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
                <button onclick="editEmployee(${emp.id})">
                    ✏️
                </button>

                <button onclick="deleteEmployee(${emp.id})">
                    ❌
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
            "💾 Зберегти";

    } else {

        button.textContent =
            "✏️ Оновити";

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