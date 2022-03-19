//local storage almacenamiento local
let events = [];
let arr = []; //cargar informacion para despues asignarla a eventos o algo asi

const eventName = document.querySelector("#eventName");
const eventDate = document.querySelector("#eventDate");
const buttonAdd = document.querySelector("#bAdd");

const eventsContainer = document.querySelector("#eventsContainer");

//local storage, solo clave valor(como cadena de texto)
const json = load();

try {
    arr = JSON.parse(json);
} catch (error) {
    arr = [];
}
//validamos al devolver la informacion por si es undefined o null puede romper la aplicacion
//asi que con el operador ternario validamos si es null o no
events = arr ? [...arr] : [];

renderEvents();

document.querySelector("form").addEventListener("submit", e =>{
    e.preventDefault();

    addEvent();
})

buttonAdd.addEventListener("click", e =>{
    e.preventDefault();

    addEvent();
})

function addEvent(){
    //si alguno esta vacio
    if(eventName.value == "" || eventDate.value == ""){
        return;
    }
    //si la fecha ya paso
    if (dateDiff(eventDate.value) < 0) {
        return;        
    }

    const newEvent = {
        id:(Math.random()*100).toString(36).slice(3),
        name: eventName.value,
        date: eventDate.value,
    };

    events.unshift(newEvent);

    save(JSON.stringify(events));//una vez que agrego un evento guardo

    eventName.value = "";

    renderEvents();

}

function dateDiff(date){
    const targetDay = new Date(date);
    const today = new Date();
    const difference = targetDay.getTime() - today.getTime();
    const days = Math.ceil(difference/(1000* 3600 * 24));
    return days;
}

function renderEvents() {
    //utiliza innerHtml porque son varios elementos a renderizar
    const eventsHTML = events.map(event => {
        return `
            <div class="event">
                <div class="days">
                    <span class="days-number">${dateDiff(event.date)}</span>
                    <span class="days-text">dias</span>
                </div>

                <div class="event-name">${event.name}</div>
                <div class="event-date">${event.date}</div>

                <div class="actions">
                    <button class="bDelete" data-id="${event.id}">Eliminar</button>
                </div>
            </div>

        `;
    });

    eventsContainer.innerHTML = eventsHTML.join("");

    document.querySelectorAll(".bDelete").forEach(button => {
        button.addEventListener("click", e => {
            const id = button.getAttribute("data-id");
            events = events.filter(event => event.id != id);

            save(JSON.stringify(events));//una vez que elimino vuelvo a guardar

            renderEvents();
        });
    });
}

function save(data){
    localStorage.setItem("items",data);
}

function load(){
    return localStorage.getItem("items");
}