// DOM elements
let modal = document.getElementById('modalWindow');
let allUsersTable = document.getElementById('allUsersTable');
let newUsersTab = document.getElementById('NewUserTab');
let saveNewUserForm = document.querySelector('.form');

let modalId = document.getElementById('modalId');
let modalName = document.getElementById('modalName');
let modalLastName = document.getElementById('modalLastName');
let modalAge = document.getElementById('modalAge');
let modalEmail = document.getElementById('modalEmail');
let modalPassword = document.getElementById('modalPassword');
let modalRoles = document.getElementById('modalRoles');



// FETCH API методы
const fetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    getAllUsers: async () => await fetch('http://localhost:8080/api/users'),
    getUserById: async (id) => await fetch(`http://localhost:8080/api/users/${id}`),
    addNewUser: async (user) => await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: fetchService.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`http://localhost:8080/api/users/${id}`, {
        method: 'PUT',
        headers: fetchService.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`http://localhost:8080/api/users/${id}`, {method: 'DELETE', headers: fetchService.head}),

    getAllRoles: async () => await fetch('http://localhost:8080/api/roles'),

    getRoleById: async (id) => await fetch(`http://localhost:8080/api/roles/${id}`)

}

// App init
async function appInit() {
    await getTableWithAllUsers();
}
appInit();


//Переключение между вкладками
newUsersTab.addEventListener('click', async () => {
    await getRolesForForm('newUserForm');
})

//загрузка таблицы с пользователями

async function getTableWithAllUsers() {

    await fetchService.getAllUsers()
        .then(res => res.json())
        .then(users => {
            document.getElementById('allUsersTableBody').innerHTML = '';

            users.forEach(user => {

                let roles = user.roles;
                let roleNames = '';
                roles.forEach(role => {
                    roleNames += role.name + ' ';
                })

                // Заполнение таблицы с юзерами
                let objectForRow = [user.id,user.name, user.lastName, user.age, user.email, roleNames];

                let row = document.getElementById('allUsersTableBody').insertRow();

                for (let i = 0; i < 8; i++) {
                    let cell = document.createElement('td');
                    let cellData ='';
                    if (i === 6) {
                        cellData = document.createElement('btn');
                        cellData.setAttribute('data-bs-userid', user.id);
                        cellData.setAttribute('data-bs-action', 'edit');
                        cellData.setAttribute('class', 'btn btn-info');
                        cellData.setAttribute('data-bs-target', '#modalWindow');
                        cellData.setAttribute('id', 'modalButton');
                        cellData.setAttribute('data-bs-toggle', 'modal');
                        cellData.textContent = 'Edit';
                    } else if (i === 7) {
                        cellData = document.createElement('btn');
                        cellData.setAttribute('data-bs-userid', user.id);
                        cellData.setAttribute('data-bs-action', 'delete');
                        cellData.setAttribute('class', 'btn btn-danger');
                        cellData.setAttribute('data-bs-target', '#modalWindow');
                        cellData.setAttribute('id', 'modalButton');
                        cellData.setAttribute('data-bs-toggle', 'modal');
                        cellData.textContent = 'Delete';
                    } else {
                        cellData = document.createTextNode(objectForRow[i])
                    }

                    cell.appendChild(cellData);
                    row.appendChild(cell);
                }

        })


    let openModalButtons = allUsersTable.querySelectorAll('.btn');
    for (let button of openModalButtons) {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            let targetButton = e.target;

            let buttonUserAction = targetButton.getAttribute("data-bs-action");
            let buttonUserId = targetButton.getAttribute("data-bs-userid");

            modal.setAttribute('data-bs-userid', buttonUserId);
            modal.setAttribute('data-bs-action', buttonUserAction);
            modal.classList.add('show');

            if (modal.classList.contains('show')) {
                let userid = modal.getAttribute('data-bs-userid');
                let action = modal.getAttribute('data-bs-action');

                switch (action) {
                    case 'edit':
                        document.getElementById('modalLabel').textContent = 'Edit user';
                        editUser(modal, userid);
                        break;
                    case 'delete':
                        document.getElementById('modalLabel').textContent = 'Delete user';
                        deleteUser(modal, userid);
                        break;
                }
            }

            })

    }
})
}

//Получение пустой формы для создания юзера (с ролями)
async function getRolesForForm(formType) {

    await fetchService.getAllRoles()
        .then(res => res.json())
        .then(roles => {
            let rolesData = ``;
            roles.forEach(role => {
                rolesData += `<option value="${role.id}" id="modalRolesInput">${role.name}</option>`
            })
            switch (formType) {
                case 'modalForm':
                    document.getElementById('modalRoles').innerHTML = rolesData;
                    break;
                case 'newUserForm':
                    document.getElementById('newUserRoles').innerHTML = rolesData;
                    break;
            }

        })
}

//Заполнение модального окна данными пользователя
async function fillModalForm(user, action) {
    switch (action) {
        case ('delete'):
            modalName.disabled = true;
            modalLastName.disabled = true;
            modalAge.disabled = true;
            modalEmail.disabled = true;
            modalPassword.disabled = true;
            modalRoles.disabled = true;
            let deleteButton = document.createElement('btn');
            deleteButton.setAttribute('class', 'btn btn-danger');
            deleteButton.setAttribute('id', 'deleteButton');
            deleteButton.setAttribute('data-bs-dismiss', 'modal');
            deleteButton.textContent = 'Delete';
            document.getElementById('modalFooter')
                .insertBefore(deleteButton, document.getElementById('modalCloseButton'));
            break;
        case ('edit'):
            modalName.disabled = false;
            modalLastName.disabled = false;
            modalAge.disabled = false;
            modalEmail.disabled = false;
            modalPassword.disabled = false;
            modalRoles.disabled = false;
            let editButton = document.createElement('btn');
            editButton.setAttribute('class', 'btn btn-success');
            editButton.setAttribute('id', 'editButton');
            editButton.setAttribute('data-bs-dismiss', 'modal');
            editButton.textContent = 'Edit';
            document.getElementById('modalFooter')
                .insertBefore(editButton, document.getElementById('modalCloseButton'));
            break;
    }

    modalId.setAttribute('value', user.id);
    modalName.setAttribute('value', user.name);
    modalLastName.setAttribute('value', user.lastName);
    modalAge.setAttribute('value', user.age);
    modalEmail.setAttribute('value', user.email);
    modalPassword.setAttribute('value', user.password);

    await getRolesForForm('modalForm');
}

async function parsedRolesFromInput(rolesInputName) {
    let roles = [];
    let rolesSelected = document.getElementById(rolesInputName).selectedOptions;
    console.log(rolesSelected)
    for (let i = 0; i < rolesSelected.length; i++) {
        let role = {
            id: document.getElementById(rolesInputName).selectedOptions[i].value,
            name: document.getElementById(rolesInputName).selectedOptions[i].text
        }
        roles.push(role)

    }
    return roles;
}
//Добавление нового юзера

async function addNewUser() {

    let roles = await parsedRolesFromInput('newUserRoles');

    let user = {
        name: document.getElementById('newUserInputName').value,
        lastName: document.getElementById('newUserInputLastName').value,
        age: document.getElementById('newUserInputAge').value,
        email: document.getElementById('newUserInputEmail').value,
        password: document.getElementById('newUserInputPassword').value,
        roles: roles
    };

    let response = await fetchService.addNewUser(user);

    if (response.ok) {
        await getTableWithAllUsers();
        document.getElementById('UsersTable').setAttribute("class", "tab-pane fade show active");
        document.getElementById('NewUser').setAttribute("class", "tab-pane fade");
        document.getElementById('UsersTableTab').setAttribute("class", "nav-link active");
        document.getElementById('NewUserTab').setAttribute("class", "nav-link");
        document.getElementById('newUserForm').reset();
    } else {
        console.log(response)
    }
}

//Обработка нажатия на кнопку сохранения юзера
saveNewUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    await addNewUser();
});


//Изменение юзера
async function editUser(modal, id) {

    let editButton = '';

    await fetchService.getUserById(id)
        .then(res => res.json())
        .then(user => {
            fillModalForm(user, 'edit');
        })

     document.getElementById('editButton').addEventListener('click', async (e) => {
         e.preventDefault();
         let id = document.getElementById('modalId').value.trim();
         let name = document.getElementById('modalName').value.trim();
         let lastName = document.getElementById('modalLastName').value.trim();
         let email = document.getElementById('modalEmail').value.trim();
         let password = document.getElementById('modalPassword').value.trim();
         let age = document.getElementById('modalAge').value.trim();

         let roles = await parsedRolesFromInput('modalRoles');

         let userUpdated = {
             id: id,
             name: name,
             lastName: lastName,
             email: email,
             password: password,
             age: age,
             roles: roles
         }

         const response = await fetchService.updateUser(userUpdated, id);

         if (response.ok) {
                     await getTableWithAllUsers();
                     modal.classList.remove('show');
                     document.getElementById('editButton').remove();

                 } else {
             console.log('error in edit method')

                 }
     })



}

//Удаление юзера
async function deleteUser(modal, id) {

    await fetchService.getUserById(id)
        .then(res => res.json())
        .then(user => {
            fillModalForm(user, 'delete');
        })


    document.getElementById('deleteButton').addEventListener('click', async(e) => {
        e.preventDefault();
        console.log(e.target)
        const response = await fetchService.deleteUser(id);
        if (response.ok) {
            await getTableWithAllUsers();
            modal.classList.remove('show');
            document.getElementById('deleteButton').remove();

        } else {
            console.log(response);
        }
    })




}










