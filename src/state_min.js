function initStateJS(p){function o(s){if(s.length===1){return s[0]}throw"initial pseudo states must have one and only one outbound transition"}function a(s){var t=s.filter(function(u){return !u.isElse&&u.guard()});if(t.length>1){return t[(t.length-1)*Math.random()]}if(t.length===0){t=s.filter(function(u){return u.isElse})}if(t.length===1){return t[0]}throw"choice pseudo state has no valid outbound transition"}function c(t){var s=null;t.forEach(function(u){if(!u.isElse){if(u.guard()){if(s!==null){throw"junction PseudoState has multiple valid completion transitions"}s=u}}});if(s!==null){return s}t.forEach(function(u){if(u.isElse){if(s!==null){throw"junctiom PseudoState has multiple else completion transitions"}s=u}});if(s!==null){return s}throw"junction PseudoState has no valid competion transitions"}function q(t,s,u){if(!t.active){t.active=[]}t.active[s]=u}function d(t,s){if(t.active){return t.active[s]}}function g(t,s,u){if(!t.current){t.current=[]}t.current[s]=u}function i(t,s){if(t.current){return t.current[s]}}var f={Choice:{isInitial:false,isHistory:false,completions:a},DeepHistory:{isInitial:true,isHistory:true,completions:o},Initial:{isInitial:true,isHistory:false,completions:o},Junction:{isInitial:false,isHistory:false,completions:c},ShallowHistory:{isInitial:true,isHistory:true,completions:o},Terminate:{isInitial:false,isHistory:false,completions:null}};function m(t,s){this.name=t;this.owner=s}m.prototype.qualifiedName=function(){return this.owner?this.owner+"."+this.name:this.name};m.prototype.ancestors=function(){var s=this.owner?this.owner.ancestors():[];s.push(this);return s};m.prototype.beginExit=function(s){};m.prototype.endExit=function(s){console.log("Leave: "+this.toString());q(s,this,false)};m.prototype.beginEnter=function(s){if(d(s,this)){this.beginExit(s);this.endExit(s)}console.log("Enter: "+this.toString());q(s,this,true)};m.prototype.endEnter=function(t,s){};m.prototype.toString=function(){return this.qualifiedName()};function h(t,u,s){m.call(this,t,s);this.kind=u;this.completions=[];if(this.kind.isInitial){this.owner.initial=this}}h.prototype=new m();h.prototype.constructor=h;h.prototype.beginEnter=function(s){m.prototype.beginEnter.call(this,s);if(this.kind===f.Terminate){s.IsTerminated=true}};h.prototype.endEnter=function(t,s){this.kind.completions(this.completions).traverse(t,s)};function n(t,s){m.call(this,t,s);this.completions=[];this.transitions=[]}n.prototype=new m();n.prototype.constructor=n;n.prototype.isComplete=function(s){return true};n.prototype.endExit=function(s){if(this.exit){this.exit.forEach(function(t){t()})}m.prototype.endExit.call(this,s)};n.prototype.beginEnter=function(s){m.prototype.beginEnter.call(this,s);if(this.owner){g(s,this.owner,this)}if(this.entry){this.entry.forEach(function(t){t()})}};n.prototype.endEnter=function(u,t){if(this.isComplete(u)){var s=null;this.completions.forEach(function(v){if(v.guard()){if(s!==null){throw"more than one completion transition found"}s=v}});if(s!==null){s.traverse(u,t)}}};n.prototype.process=function(t,u){if(t.isTerminated){return false}var s=null;this.transitions.forEach(function(v){if(v.guard(u)){if(s!==null){throw"more than one transition found for message: "+u.toString()}s=v}});if(s!==null){s.traverse(t,u)}return s!==null};function k(t,s){n.call(this,t,s)}k.prototype=new n();k.prototype.constructor=k;k.prototype.isComplete=function(s){return s.isTerminated||i(s,this).isFinalState};k.prototype.beginExit=function(s){var t=i(s,this);if(t){t.beginExit(s);t.endExit(s)}};k.prototype.endEnter=function(t,s){var u=(s||this.initial.kind.isHistory?i(t,this):this.initial)||this.initial;u.beginEnter(t);u.endEnter(t,s||this.initial.kind===f.DeepHistory);n.prototype.endEnter.call(this,t,s)};k.prototype.process=function(s,t){if(s.isTerminated){return false}return n.prototype.process.call(this,s,t)||i(s,this).process(s,t)};function r(t,s){n.call(this,t,s);this.regions=[]}r.prototype=new n();r.prototype.constructor=r;r.prototype.isComplete=function(s){return s.isTerminated||this.regions.every(function(t){return t.isComplete(s)})};r.prototype.beginExit=function(s){this.regions.forEach(function(t){if(d(s,t)){t.beginExit(s);t.endExit(s)}})};r.prototype.endEnter=function(t,s){this.regions.forEach(function(u){u.beginEnter(t);u.endEnter(t,s)});n.PseudoState.endEnter.call(t,s)};r.prototype.process=function(s,t){if(s.isTerminated){return false}return n.prototype.process.call(this,s,t)||this.regions.reduce(function(u,v){return v.process(s,t)||u},false)};function l(t,s){n.call(this,t,s);this.isFinalState=true}l.prototype=new n();l.prototype.constructor=l;delete l.prototype.comlpetions;delete l.prototype.transitions;l.prototype.process=function(s,t){return false};function b(t,s){m.call(this,t,s);this.initial=null;if(this.owner){this.owner.regions.push(this)}}b.prototype=new m();b.prototype.constructor=b;b.prototype.isComplete=function(s){return s.isTerminated||i(s,this).isFinalState};b.prototype.initialise=function(s){this.beginEnter(s);this.endEnter(s,false)};b.prototype.beginExit=function(s){var t=i(s,this);if(t){t.beginExit(s);t.endExit(s)}};b.prototype.endEnter=function(t,s){var u=(s||this.initial.kind.isHistory?i(t,this):this.initial)||this.initial;u.beginEnter(t);u.endEnter(t,s||this.initial.kind===f.DeepHistory)};b.prototype.process=function(s,t){if(s.isTerminated){return false}return d(s,this)&&i(s,this).process(s,t)};function j(u,t,s){return u[s]===t[s]?j(u,t,s+1):s}function e(t,v,s){this.guard=s||function(y){return true};if(v){var x=t.ancestors(),w=v.ancestors(),u=t.owner===v.owner?x.length-1:j(x,w,0);this.exit=x.slice(u);this.enter=w.slice(u);this.exit.reverse()}t[s&&s.length>0?"transitions":"completions"].push(this)}e.prototype.traverse=function(s,t){if(this.exit){this.exit[0].beginExit(s);this.exit.forEach(function(u){u.endExit(s)})}if(this.effect){this.effect.forEach(function(u){u(t)})}if(this.enter){this.enter.forEach(function(u){u.beginEnter(s)});this.enter[this.enter.length-1].endEnter(s,false)}};e.Else=function(s,t){e.call(this,s,t,function(){return false});this.isElse=true};e.Else.prototype=e.prototype;e.Else.prototype.constructor=e.Else;p.Element=m;p.PseudoStateKind=f;p.PseudoState=h;p.SimpleState=n;p.CompositeState=k;p.OrthogonalState=r;p.FinalState=l;p.Region=b;p.Transition=e}if(this.exports){initStateJS(this.exports)}else{if(this.define){this.define(function(b,a,c){initStateJS(a)})}else{initStateJS(this)}};