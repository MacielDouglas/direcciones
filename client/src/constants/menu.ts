// MenuOptions
export const menuOptions = {
  tarjetas: {
    label: "Tarjetas",
    path: "/my-cards",
    info: "Acesse las tarjetas asignadas",
  },
  direcciones: {
    label: "Direcciones",
    path: "/addresses",
    info: "Puede enviar una nueva dirreción o corfirmar si ya existe esta dirección.",
  },

  user: {
    label: "Perfil",
    path: "/user",
    info: "Acesso a su cuenta, modificar el nombre y la imagen.",
  },
} as const;

// MenuSs
export const menuSs = {
  users: {
    label: "Usuarios",
    path: "/users",
    info: "Administración de los usuarios",
  },
  Asignar: {
    label: "Asignar",
    path: "/cards",
    info: "Asignar tarjetas a los usuarios",
  },
} as const;

// Objeto principal que agrupa todos os menus (opcional)
export const Menus = {
  menuOptions,
  menuSs,
} as const;
