import React, { useState } from 'react';
import { CustomInput } from '../../../../../../components/inputs/Inputs';
import { IoClose } from "react-icons/io5";

export default function EmailModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    email: '',
    confEmail: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm(e.target.value);
  };

  const handleSave = () => {
    e.preventDefault();

    const errors = {};
    
    if (!form.email || !form.email.match(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)) {
      errors.email = 'Digite um Email válido';
    } 

    if (form.email !== form.confEmail) {
      errors.confEmail = 'Os Emails devem ser iguais';
    }

    setErrors(errors);

    console.log('Erros:', errors);

    if (Object.keys(errors).length === 0) {
      // Lógica de envio do formulário aqui
      console.log('Dados do formulário:', form);
      onSave(form.email);
      onClose();
    }
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="containerModal">
        <h2>Atualizar Email</h2>
        <p>
            <CustomInput
              type="text"
              label="Email:"
              id="email"
              name="email"
              maxLength={40}
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <span className='invalid'>{errors.email}</span>}
          </p>

          <p>
            <CustomInput
              type="text"
              label="Confirme seu Email:"
              id="confEmail"
              name="confEmail"
              maxLength={40}
              value={form.confEmail}
              onChange={handleChange}
            />
            {errors.confEmail && <span className='invalid'>{errors.confEmail}</span>}
          </p>
        <button type='button' onClick={handleSave}>Salvar</button>
        <IoClose onClick={onClose} className='iconClose' />
      </div>
    </div>
  );
}