const courses=[{subject:'WDD',number:130,credits:2,completed:true},{subject:'CSE',number:110,credits:2,completed:false},{subject:'WDD',number:131,credits:2,completed:true},{subject:'CSE',number:111,credits:2,completed:false},{subject:'CSE',number:210,credits:2,completed:false},{subject:'WDD',number:231,credits:2,completed:false}];
const c=document.getElementById('courses'),t=document.getElementById('creditTotal');
function show(list){c.innerHTML='';list.forEach(x=>{let a=document.createElement('article');a.className='course-card'+(x.completed?' completed':'');a.innerHTML=`<h3>${x.subject} ${x.number}</h3><p>${x.credits} Credits</p>`;c.append(a)});t.textContent=list.reduce((s,x)=>s+x.credits,0)}
show(courses);
allCourses.onclick=()=>show(courses);
wddCourses.onclick=()=>show(courses.filter(x=>x.subject==='WDD'));
cseCourses.onclick=()=>show(courses.filter(x=>x.subject==='CSE'));