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





async function getTableWithAllUsers() {

    await fetchService.getAllUsers()
        .then(res => res.json())
        .then(users => {
            let tableData = ''

            users.forEach(user => {

                let roles = user.roles;
                let roleNames = '';
                roles.forEach(role => {
                    roleNames += role.name + ' ';
                })


                tableData += `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>
                            <td>${user.username}</td>
                            <td>${roleNames}</td>
                            <td>
                                <button type="submit" data-bs-userid="${user.id}" data-bs-action="edit" class="btn btn-info"
                                data-bs-toggle="modal" data-bs-target="#modalWindow" id="modalButton" name="modalButton"
                                value="edit" data-bs-whatever="${user.id}">Edit</button>
                              </td>
                            <td>
                                <button type="button" data-bs-userid="${user.id}" data-bs-action="delete" class="btn btn-danger"
                                data-bs-toggle="modal" data-bs-target="#modalWindow" id="modalButton" name="modalButton" value="delete">Delete</button>
                            </td>
                        </tr>
                `;
            });
            document.getElementById('allUsersTableBody').innerHTML = tableData;
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
                        editUser(modal, userid);
                        break;
                    case 'delete':
                        deleteUser(modal, userid);
                        break;
                }
            }

            })

    }
}

//Получение пустой формы для создания юзера (с ролями)
async function getRolesForForm(formType) {

    await fetchService.getAllRoles()
        .then(res => res.json())
        .then(roles => {
            let rolesData = ``;
            roles.forEach(role => {
                rolesData += `<option value="${role.id}">${role.name}</option>`
            })
            switch (formType) {
                case 'modalForm':
                    console.log('modal form get roles')
                    document.getElementById('modalRoles').innerHTML = rolesData;
                    break;
                case 'newUserForm':
                    document.getElementById('newUserRoles').innerHTML = rolesData;
                    break;
            }

        })
}

//Добавление нового юзера

async function addNewUser() {

    let roles = [];
    let rolesSelected = document.getElementById('newUserRoles').selectedOptions;
    console.log(rolesSelected)
    for (let i = 0; i < rolesSelected.length; i++) {
        let role = {
            id: document.getElementById('newUserRoles').selectedOptions[i].value,
            name: document.getElementById('newUserRoles').selectedOptions[i].text
        }
        roles.push(role)

    }

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
    await fetchService.getUserById(id)
        .then(res => res.json())
        .then(user => {
            modalId.setAttribute('value', user.id);
            modalName.setAttribute('value', user.name);
            modalLastName.setAttribute('value', user.lastName);
            modalAge.setAttribute('value', user.age);
            modalEmail.setAttribute('value', user.email);
            modalPassword.setAttribute('value', user.password);
            getRolesForForm('modalForm');

            let buttons = `<button  class="btn btn-outline-success" id="editButton" data-bs-dismiss="modal">Edit</button>
             <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
            modal.querySelector('.modal-footer').innerHTML = buttons;

        })

     document.getElementById("editButton").addEventListener('click', async (e) => {
         e.preventDefault();
         let id = document.getElementById('modalId').value.trim();
         let name = document.getElementById('modalName').value.trim();
         let lastName = document.getElementById('modalLastName').value.trim();
         let email = document.getElementById('modalEmail').value.trim();
         let password = document.getElementById('modalPassword').value.trim();
         let age = document.getElementById('modalAge').value.trim();


         let roles = {
             id: document.getElementById('modalRoles').selectedOptions[0].value,
             name: document.getElementById('modalRoles').selectedOptions[0].text
         }

         console.log("проверить роли" + roles);

         let userUpdated = {
             id: id,
             name: name,
             lastName: lastName,
             email: email,
             password: password,
             age: age,
             roles: [roles]
         }


         console.log(userUpdated)
         console.log(userUpdated.roles)

         const response = await fetchService.updateUser(userUpdated, id);

         if (response.ok) {
                     await getTableWithAllUsers();
                     modal.classList.remove('show');

                 } else {
                     let body = await response.json();
                     let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                                     ${body.info}
                                     <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                         <span aria-hidden="true">&times;</span>
                                     </button>
                                 </div>`;
                     modal.querySelector('.modal-body').innerHTML = alert;
                 }

     })



}

async function deleteUser(modal, id) {
    await fetchService.getUserById(id)
        .then(res => res.json())
        .then(user => {
            let bodyForm = `
           <form>
           <label class="form-label fw-bold">ID</label>
                    <input type="number" class="form-control form-control-sm-6 disabled" name="name"
                           style="background-color: lightgray" value="${user.id}" id="modalId"/>
            <label class="form-label fw-bold">First name</label>
                    <input type="text" class="form-control form-control-sm-6" name="name"
                           style="background-color: lightgray" value="${user.name}" id="modalName"/>
                    <label class="form-label fw-bold">Last name</label>
                    <input type="text" class="form-control form-control-sm-6" name="lastName" 
                    value="${user.lastName}" id="modalLastName"/>

                    <label class="form-label fw-bold">Age</label>
                    <input type="number" class="form-control form-control-sm-6" name="age" 
                    value="${user.age}" id="modalAge"/>

                    <label class="form-label fw-bold">E-mail</label>
                    <input type="email" class="form-control form-control-sm-6" name="email" 
                    value="${user.email}" id="modalEmail"/>

                    <label class="form-label fw-bold">Password</label>
                    <input type="password" class="form-control form-control-sm-6"
                           name="password" value="${user.password}" id="modalPassword"/>

                    <label class="form-label fw-bold">Roles</label>
                    <div>
                    <select className="form-control" name="roles" multiple size=${user.roles.length} id="modalRoles">
                    <div>
        `;

            user.roles.forEach(role => {
                bodyForm += `<option>${role.name}</option>`
                   
            });

            bodyForm += `</div>
                </select>
                </div>
                </form>`;

            document.getElementById('modalFormBody').innerHTML = bodyForm;
            let buttons = `<button  class="btn btn-danger" id="deleteButton" data-bs-dismiss="modal">Delete</button>
             <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
            modal.querySelector('.modal-footer').innerHTML = buttons;

        })

    document.getElementById('deleteButton').addEventListener('click', async(e) => {
        console.log(e.target)
        const response = await fetchService.deleteUser(id);
        if (response.ok) {
            getTableWithAllUsers();
            modal.classList.remove('show');

            //modal.hide();
            //modal.setAttribute('data-bs-backdrop', 'false');

        } else {
            console.log(response);
        }
    })




}










