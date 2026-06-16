let employees = [];
let editId = null;


// ============================
// Завантаження працівників
// ============================

async function loadEmployees() {

    try {

        const response = await fetch("/employees");

        employees = await response.json();

        renderTable(employees);

    } catch(error) {

        console.error(
            "Помилка завантаження:",
            error
        );
    }
}


// ============================
// Відображення таблиці
// ============================

function renderTable(data) {

    const body = document.getElementById("tableBody");

    body.innerHTML = "";


    data.forEach((emp, index) => {

        const row = document.createElement("tr");


        row.innerHTML = `
            <td>${index + 1}</td>

            <td>${emp.name}</td>

            <td>${formatDate(emp.birthday)}</td>

            <td>
                <button class="edit-btn" onclick="editEmployee(${emp.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                </button>

                <button class="delete-btn" onclick="deleteEmployee(${emp.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </button>
            </td>
        `;


        body.appendChild(row);
    });
}


// ============================
// Формат дати
// ============================

function formatDate(date) {

    const parts = date.split("-");

    return `
        ${parts[2]}.${parts[1]}.${parts[0]}
    `.trim();
}


// ============================
// Додавання / редагування
// ============================

async function saveEmployee() {

    const name =
        document
        .getElementById("nameInput")
        .value
        .trim();


    const birthday =
        document
        .getElementById("dateInput")
        .value;


    if(!name || !birthday) {

        alert(
            "Заповни всі поля"
        );

        return;
    }


    const data = {
        name,
        birthday
    };


    try {

        if(editId === null) {


            // ДОДАТИ
            await fetch("/employees", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)

            });


        } else {


            // РЕДАГУВАТИ
            await fetch(`/employees/${editId}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)

            });


            editId = null;
        }


        clearForm();

        changeButtonText();

        loadEmployees();


    } catch(error) {

        console.error(
            "Помилка збереження:",
            error
        );
    }
}


// ============================
// Почати редагування
// ============================

function editEmployee(id) {


    const employee =
        employees.find(emp =>
            emp.id === id
        );


    if(!employee) return;


    document.getElementById("nameInput")
        .value = employee.name;


    document.getElementById("dateInput")
        .value = employee.birthday;


    editId = id;


    changeButtonText();

}


// ============================
// Видалення
// ============================

async function deleteEmployee(id) {


    const answer =
        confirm(
            "Видалити співробітника?"
        );


    if(!answer) return;


    try {

        await fetch(`/employees/${id}`, {

            method: "DELETE"

        });


        loadEmployees();


    } catch(error) {

        console.error(
            "Помилка видалення:",
            error
        );
    }

}


// ============================
// Пошук
// ============================

function search() {


    const value =
        document
        .getElementById("search")
        .value
        .toLowerCase();


    const filtered =
        employees.filter(emp =>
            emp.name
            .toLowerCase()
            .includes(value)
        );


    renderTable(filtered);

}


// ============================
// Очистка форми
// ============================

function clearForm() {


    document.getElementById("nameInput")
        .value = "";


    document.getElementById("dateInput")
        .value = "";

}


// ============================
// Зміна тексту кнопки
// ============================

function changeButtonText() {


    const button =
        document.querySelector(".save-btn");


    if(!button) return;


    if(editId === null) {

        button.textContent =
            "Зберегти";

    } else {

        button.textContent =
            "Оновити";

    }

}


// ============================
// Робимо доступними для HTML
// ============================

window.saveEmployee =
    saveEmployee;


window.editEmployee =
    editEmployee;


window.deleteEmployee =
    deleteEmployee;


window.search =
    search;


window.toggleSection = toggleSection;    
// Відкрити / закрити секцію

function toggleSection(id) {

    const section =
        document.getElementById(id);


    section.classList.toggle("hidden");
}


// Робимо доступною з HTML

window.toggleSection =
    toggleSection;


async function loadCurrentMonth() {

    try {

        const response =
            await fetch("/employees/month/current");


        const people =
            await response.json();


        const list =
            document.getElementById("monthList");


        list.innerHTML = "";


        if(people.length === 0) {

            list.innerHTML =
                "<p>У цьому місяці немає іменинників 🎉</p>";

            return;
        }


        people.forEach(person => {

            const card =
                document.createElement("div");


            card.className = "birthday-card";


            const day =
                person.birthday.split("-")[2];


            card.innerHTML = `
                <div class="birthday-day">
                    ${day}
                </div>

                <div class="birthday-name">
                    ${person.name}
                </div>
            `;


            list.appendChild(card);

        });


    } catch(error) {

        console.log(error);

    }

}

function toggleSection(id) {

    const section =
        document.getElementById(id);


    section.classList.toggle("hidden");


    if(id === "monthSection" &&
       !section.classList.contains("hidden")) {

        loadCurrentMonth();

    }

}

// ============================
// Старт
// ============================

loadEmployees();