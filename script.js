const apiUrl = "https://csrent-ptb3.onrender.com/users";

document.addEventListener("DOMContentLoaded", () => {
  loadUsers();

  document.getElementById("userForm").addEventListener("submit", handleSubmit);
  document.getElementById("searchBar").addEventListener("input", e => loadUsers(e.target.value));
});

function loadUsers(query = "") {
  fetch(apiUrl)
    .then(res => res.json())
    .then(users => {
      const list = document.getElementById("userList");
      list.innerHTML = "";

      users
        .filter(user => user.name?.toLowerCase().includes(query.toLowerCase()))
        .forEach(user => {
          const card = document.createElement("div");
          card.className = "card";
          card.innerHTML = `
            <h3>${user.name}</h3>
            <p>${user.email}</p>
            <button class="edit" onclick="editUser(${user.id}, '${user.name}', '${user.email}')">Edit</button>
            <button class="delete" onclick="deleteUser(${user.id})">Delete</button>
          `;
          list.appendChild(card);
        });
    });
}

function handleSubmit(e) {
  e.preventDefault();

  const id = document.getElementById("userId").value;
  const name = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const rol = document.getElementById("rol").value;

  const userDTO = { name, email, password, rol };

  const url = id ? apiUrl : `${apiUrl}/signUp`;
  const method = id ? "PUT" : "POST";

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userDTO)
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al guardar");
      return res.json();
    })
    .then(() => {
      document.getElementById("userForm").reset();
      loadUsers();
    })
    .catch(err => console.error("Error:", err));
}

function editUser(id, name, email) {
  document.getElementById("userId").value = id;
  document.getElementById("username").value = name;
  document.getElementById("email").value = email;
}

function deleteUser(id) {
  fetch(`${apiUrl}/${id}`, { method: "DELETE" })
    .then(() => loadUsers());
}
