async function sendMessage(){

const text = document.getElementById("userInput").value;

if(text === ""){
alert("Please enter your skills");
return;
}

document.getElementById("career").innerText = "Analyzing...";

const response = await fetch("http://127.0.0.1:8000/analyze",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
message:text
})
});

const data = await response.json();

displayResults(data);

}


function displayResults(data){

// ----------------
// Detected Skills
// ----------------

const skillsList = document.getElementById("skills");
skillsList.innerHTML = "";

data.detected_skills.forEach(skill=>{
const li = document.createElement("li");
li.innerText = skill;
skillsList.appendChild(li);
});


// ----------------
// Recommended Career
// ----------------

document.getElementById("career").innerText =
data.recommended_career
.split(" ")
.map(w => w.toUpperCase() === "NLP" ? "NLP" : w.charAt(0).toUpperCase() + w.slice(1))
.join(" ");


// ----------------
// Top Career Matches
// ----------------

const topList = document.getElementById("topCareers");
topList.innerHTML = "";

data.top_careers.forEach(item => {

const li = document.createElement("li");

li.innerText =
item[0].replace(/\b\w/g,c=>c.toUpperCase()) + " — " + item[1] + "%";

topList.appendChild(li);

});


// ----------------
// Missing Skills
// ----------------

const missingList = document.getElementById("missing");
missingList.innerHTML = "";

data.missing_skills.forEach(skill=>{
const li = document.createElement("li");
li.innerText = skill;
missingList.appendChild(li);
});


// ----------------
// Learning Roadmap
// ----------------

const roadmapList = document.getElementById("roadmap");
roadmapList.innerHTML = "";

data.roadmap.forEach(step=>{
const li = document.createElement("li");
li.innerText = step;
roadmapList.appendChild(li);
});

const resourceDiv = document.getElementById("resources");
resourceDiv.innerHTML = "";

for(const skill in data.resources){

const skillTitle = document.createElement("h4");
skillTitle.innerText = skill;

const ul = document.createElement("ul");

data.resources[skill].forEach(r=>{
const li = document.createElement("li");
li.innerText = r;
ul.appendChild(li);
});

resourceDiv.appendChild(skillTitle);
resourceDiv.appendChild(ul);

}

// ----------------
// Charts
// ----------------

createCareerChart(data.top_careers);
createSkillRadar(data.expanded_skills);

}


// ----------------
// Career Match Chart
// ----------------

let careerChart;

function createCareerChart(careers){

const labels = careers.map(c =>
c[0].replace(/\b\w/g,l=>l.toUpperCase())
);

const scores = careers.map(c => c[1]);

const ctx = document.getElementById("careerChart");

if(careerChart){
careerChart.destroy();
}

careerChart = new Chart(ctx,{
type:"bar",
data:{
labels:labels,
datasets:[{
label:"Match %",
data:scores,
backgroundColor:"#38bdf8"
}]
},
options:{
plugins:{
legend:{display:false}
},
scales:{
y:{
beginAtZero:true,
max:100
}
}
}
});

}


// ----------------
// Skill Radar Chart
// ----------------

let radarChart;

function createSkillRadar(skills){

const labels = skills.slice(0,6);

const values = labels.map(()=>Math.floor(Math.random()*40)+60);

const ctx = document.getElementById("skillRadar");

if(radarChart){
radarChart.destroy();
}

radarChart = new Chart(ctx,{
type:"radar",
data:{
labels:labels,
datasets:[{
label:"Skill Strength",
data:values,
backgroundColor:"rgba(56,189,248,0.2)",
borderColor:"#38bdf8",
borderWidth:2
}]
},
options:{
plugins:{
legend:{display:false}
},
scales:{
r:{
beginAtZero:true,
max:100
}
}
}
});

}