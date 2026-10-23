// Plain local tool settings, separate from the universal presentation package.
export const VERSION = 1;
export const fields = [
 ['Timing','timing.hold','Standing still',0,5,.01,'s'],
 ['Timing','timing.exit','Leaving center',.05,5,.01,'s'],
 ['Timing','timing.enter','Entering center',.05,5,.01,'s'],
 ['Timing','timing.settle','Settling after arrival',0,3,.01,'s'],
 ['Focus and spring','centerEmphasis.scale','Focused pill size',1,1.8,.01,'×'],
 ['Focus and spring','centerEmphasis.lift','Focused pill rise',0,48,1,'px'],
 ['Focus and spring','centerEmphasis.range','Focus reach',.1,1,.01,'of lane'],
 ['Focus and spring','springTuning.stretch','Incoming horizontal stretch',0,.5,.01,'ratio'],
 ['Focus and spring','springTuning.squash','Vertical compression',0,.5,.01,'ratio'],
 ['Focus and spring','springTuning.overshoot','Arrival overshoot',0,48,1,'px'],
 ['Focus and spring','springTuning.popLift','Arrival pop rise',0,48,1,'px'],
 ['Focus and spring','springTuning.nudge','Outgoing push',0,24,1,'px'],
 ['Edge blur','edgeBlur','Maximum edge blur',0,8,.1,'px'],
 ['Edge blur','edgeBlurStart','Blur begins away from center',0,1,.01,'center → edge'],
 ['Layout','spacing','Minimum pill gap',0,96,1,'px'],
 ['Layout','previewWidth','Preview width',280,1800,1,'px'],
 ['Linear motion','speed','Continuous speed',1,240,1,'px/s'],
];
export const defaults = {version:VERSION,motion:'spring',direction:'left',timing:{hold:.14,exit:1.02,enter:1.02,settle:.12},springTuning:{stretch:.06,squash:.03,overshoot:5,popLift:6,nudge:2},edgeBlur:1,edgeBlurStart:.75,spacing:8,centerEmphasis:{scale:1.16,lift:4,range:.5},badgeAppearance:{size:'sm',shape:'pill',textTone:'navy'},speed:38,previewWidth:950,items:['16 DFW LOCATIONS','PRICE BEAT GUARANTEE','FREE POP-ITS W/ FOLLOW','OPEN DAILY THROUGH JULY 5TH','AMERICA’S 250TH ANNIVERSARY','BUY HERE LIGHT HERE — $30/CAR']};
export const clone = value => JSON.parse(JSON.stringify(value));
export const get = (object,key) => key.split('.').reduce((value,part)=>value?.[part],object);
export const set = (object,key,value) => {const parts=key.split('.'),last=parts.pop();let target=object;for(const part of parts)target=target[part];target[last]=value;};
export function validate(candidate) {
 if(!candidate||typeof candidate!=='object'||candidate.version!==VERSION)throw Error('Use a version 1 settings object.');
 const result=clone(defaults);
 for(const[,key,,min,max]of fields){const value=get(candidate,key);if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max)throw Error(`${key} must be ${min}–${max}.`);set(result,key,value);}
 for(const[key,values]of[['motion',['spring','linear']],['direction',['left','right']],['badgeAppearance.size',['sm','md']],['badgeAppearance.shape',['pill','rounded']],['badgeAppearance.textTone',['navy','red']]]){const value=get(candidate,key);if(!values.includes(value))throw Error(`Invalid ${key}.`);set(result,key,value);}
 if(!Array.isArray(candidate.items)||candidate.items.length<1||candidate.items.length>30||candidate.items.some(v=>typeof v!=='string'||!v.trim()||v.length>200))throw Error('Use 1–30 nonempty pill labels, each at most 200 characters.');
 result.items=candidate.items.map(v=>v.trim());return result;
}
export function componentProps(settings,paused=false){const{version,previewWidth,...props}=settings;return {...props,speed:paused?0:props.speed};}
