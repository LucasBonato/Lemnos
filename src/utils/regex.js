export const validateEmail = new RegExp(
    "^[a-zA-Z0-9._:$!%-]+@[a-zA-Z.-]+.[a-zA-Z]$"
)

export const validatePwd = new RegExp(
    "^([a-zA-Z0-9]).{8,16}$"
)

export const validateCpf = new RegExp(
    "^([0-9]{2}[\.]?[0-9]{3}[\.]?[0-9]{3}[\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\.]?[0-9]{3}[\.]?[0-9]{3}[-]?[0-9]{2})$"
)

export function formatCPF(cpf) {
    cpf = cpf.replace(/\D/g, ''); // Remove caracteres não numéricos
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona ponto após os 3 primeiros dígitos
    cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2'); // Adiciona ponto após os próximos 3 dígitos
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona hífen antes dos últimos 2 dígitos
    return cpf;
  }