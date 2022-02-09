
const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    getAllUsers: async () => await fetch('http://localhost:8080/api/users'),
    getUserById: async (id) => await fetch(`http://localhost:8080/api/users/${id}`),
    addNewUser: async (user) => await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`http://localhost:8080/api/users/${id}`, {
        method: 'PUT',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`http://localhost:8080/api/users/${id}`, {method: 'DELETE', headers: userFetchService.head}),

    getAllRoles: async () => await fetch('http://localhost:8080/api/roles')
}


async function appInit() {
    await getTableWithAllUsers();
}

let modal = document.getElementById('modalWindow');

let addUserForm = document.querySelector('.form');
appInit();


async function getTableWithAllUsers() {
    await userFetchService.getAllRoles()
        .then(res => res.json())
        .then(role => console.log(role));


    await userFetchService.getAllUsers()
        .then(res => res.json())
        .then(users => {
            console.log(users)
            let tableData = ''
            users.forEach(user => {
                tableData += `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.name}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>
                            <td>${user.username}</td>
                            <td>${user.roles}</td>
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


    let openModalButtons = document.getElementById('allUsersTable').querySelectorAll('.btn');
    for (let button of openModalButtons) {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("мы зашли в evennt listener")
            let targetButton = e.target;

            let buttonUserAction = targetButton.getAttribute("data-bs-action");
            let buttonUserId = targetButton.getAttribute("data-bs-userid");

            modal.setAttribute('data-bs-userid', buttonUserId);
            modal.setAttribute('data-bs-action', buttonUserAction);

            modal.classList.add('show');

            if (modal.classList.contains('show')) {
                let userid = modal.getAttribute('data-bs-userid');
                let action = modal.getAttribute('data-bs-action');
                console.log("открыттая модалка id" + userid);
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

async function getNewUserForm() {
console.log('зашли в getNewUserForm')
    await userFetchService.getAllRoles()
        .then(res => res.json())
        .then(roles => {
            console.log('роли ' + roles);
            let rolesData = `<select class="form-control" name="roles" multiple size=${roles.size}>`;
            roles.forEach(role => {
                rolesData += `<option id="inputNewUserRoles">${role.name}</option>`
            })
            rolesData += `</select>`;
            document.getElementById('newUserRoles').innerHTML = rolesData;
        })

}

document.getElementById('NewUserTab').addEventListener('click', async () => {
    await getNewUserForm();
})

//Добавление нового юзера

const addNewUser = async () => {
    let user = {
        name: document.getElementById('newUserInputName').value,
        lastName: document.getElementById('newUserInputLastName').value,
        age: document.getElementById('newUserInputAge').value,
        email: document.getElementById('newUserInputEmail').value,
        password: document.getElementById('newUserInputPassword').value,
        //roles: document.getElementById('inputNewUserRoles').selectedOptions
        roles: [{id: 1, role: "ADMIN"}]
            //.map(role => role.value)

    };

    console.log(user);

    let response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

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





addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();

    addNewUser();
});




//Изменение юзера
async function editUser(modal, id) {
    await userFetchService.getUserById(id)
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
                        <select class="form-control" name="roles" multiple size="2" id="modalRoles">
                            <div>
                                <option/>
                            </div>
                        </select>
                    </div>
                    </form>
        `;
            document.getElementById('modalFormBody').innerHTML = bodyForm;
            let buttons = `<button  class="btn btn-outline-success" id="editButton" data-bs-dismiss="modal">Edit</button>
             <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
            modal.querySelector('.modal-footer').innerHTML = buttons;

        })

     document.getElementById("editButton").addEventListener('click', async () => {
         let id = document.getElementById('modalId').value.trim();
         let name = document.getElementById('modalName').value.trim();
         let lastName = document.getElementById('modalLastName').value.trim();
         let email = document.getElementById('modalEmail').value.trim();
         let password = document.getElementById('modalPassword').value.trim();
         let age = document.getElementById('modalAge').value.trim();

         let userUpdated = {
             id: id,
             name: name,
             lastName: lastName,
             email: email,
             password: password,
             age: age,
         }

         const response = await userFetchService.updateUser(userUpdated, id);

         if (response.ok) {
                     getTableWithAllUsers();
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
    await userFetchService.getUserById(id)
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
                        <select class="form-control" name="roles" multiple size="2" id="modalRoles">
                            <div>
                                <option/>
                            </div>
                        </select>
                    </div>
                    </form>
        `;
            document.getElementById('modalFormBody').innerHTML = bodyForm;
            let buttons = `<button  class="btn btn-danger" id="deleteButton" data-bs-dismiss="modal">Delete</button>
             <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
            modal.querySelector('.modal-footer').innerHTML = buttons;

        })

    document.getElementById('deleteButton').addEventListener('click', async(e) => {
        console.log(e.target)
        const response = await userFetchService.deleteUser(id);
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










