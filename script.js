document.addEventListener("DOMContentLoaded", checkAuth);

function toggleForms() {
    document.getElementById("login-form").classList.toggle("hidden");
    document.getElementById("register-form").classList.toggle("hidden");
}

function showMessage(message, type) {
    let messageContainer = document.getElementById("message-container");
    messageContainer.textContent = message;
    messageContainer.className = `${type} card`;
    messageContainer.style.display = "block";

    setTimeout(() => {
        messageContainer.style.display = "none";
    }, 3000);
}

function register() {
    let name = document.getElementById("register-name").value.trim();
    let email = document.getElementById("register-email").value.trim();
    let password = document.getElementById("register-password").value;

    if (!name || !email || !password || password.length < 6) {
        showMessage("Todos los campos son obligatorios y la contraseña debe tener mínimo 6 caracteres.", "error");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.find(user => user.email === email)) {
        showMessage("El correo ya está registrado.", "error");
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    showMessage("Registro exitoso. Ahora inicia sesión.", "success");
    toggleForms();
}

function login() {
    let email = document.getElementById("login-email").value.trim();
    let password = document.getElementById("login-password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(user => user.email === email && user.password === password);

    if (user) {
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        // Limpiar campos después de iniciar sesión
        document.getElementById("login-email").value = "";
        document.getElementById("login-password").value = "";

        checkAuth();
    } else {
        showMessage("Credenciales incorrectas.", "error");
    }
}

function checkAuth() {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
        document.getElementById("auth-container").classList.add("hidden");
        document.getElementById("app-container").classList.remove("hidden");
        loadTasks();
    } else {
        document.getElementById("auth-container").classList.remove("hidden");
        document.getElementById("app-container").classList.add("hidden");
    }
}

function logout() {
    localStorage.removeItem("loggedInUser");

    // Redirigir al inicio de sesión
    document.getElementById("auth-container").classList.remove("hidden");
    document.getElementById("app-container").classList.add("hidden");

    showMessage("Has cerrado sesión.", "success");
}

function addTask() {
    let title = document.getElementById("task-title").value.trim();
    let desc = document.getElementById("task-desc").value.trim();
    let user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!title || !desc) {
        showMessage("Completa todos los campos.", "error");
        return;
    }

    let tasks = JSON.parse(localStorage.getItem(`tasks_${user.email}`)) || [];
    
    // Agregar nueva tarea al inicio de la lista
    tasks.unshift({ author: user.name, title, desc });

    localStorage.setItem(`tasks_${user.email}`, JSON.stringify(tasks));

    // Limpiar campos después de agregar la tarea
    document.getElementById("task-title").value = "";
    document.getElementById("task-desc").value = "";

    showMessage("Tarea agregada con éxito.", "success");
    loadTasks();
}

function loadTasks() {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    let tasks = JSON.parse(localStorage.getItem(`tasks_${user.email}`)) || [];

    let taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    tasks.forEach((task, index) => {
        let row = `<tr>
            <td>${task.author}</td>
            <td>${task.title}</td>
            <td>${task.desc}</td>
            <td>
                <i class="delete-icon fas fa-trash" onclick="deleteTask(${index})"></i>
            </td>
        </tr>`;
        taskList.innerHTML += row;
    });
}

function deleteTask(index) {
    let user = JSON.parse(localStorage.getItem("loggedInUser"));
    let tasks = JSON.parse(localStorage.getItem(`tasks_${user.email}`)) || [];

    tasks.splice(index, 1);
    localStorage.setItem(`tasks_${user.email}`, JSON.stringify(tasks));

    showMessage("Tarea eliminada con éxito.", "success");
    loadTasks();
}