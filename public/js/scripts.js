document.addEventListener('DOMContentLoaded', () => {
    const departamentoForm = document.getElementById('departamentoForm');
    const ingenieroForm = document.getElementById('ingenieroForm');
    const proyectoForm = document.getElementById('proyectoForm');

    departamentoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('departamentoNombre').value;
        const telefono = document.getElementById('departamentoTelefono').value;
        const fax = document.getElementById('departamentoFax').value;
        const response = await fetch('/api/departamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, telefono, fax })
        });
        if (response.ok) {
            alert('Departamento creado');
            loadDepartamentos();
        } else {
            alert('Error al crear departamento');
        }
    });

    ingenieroForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const especialidad = document.getElementById('ingenieroEspecialidad').value;
        const cargo = document.getElementById('ingenieroCargo').value;
        const response = await fetch('/api/ingenieros', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ especialidad, cargo })
        });
        if (response.ok) {
            alert('Ingeniero creado');
            loadIngenieros();
        } else {
            alert('Error al crear ingeniero');
        }
    });

    proyectoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('proyectoNombre').value;
        const fec_inicio = document.getElementById('proyectoFecInicio').value;
        const fec_termino = document.getElementById('proyectoFecTermino').value;
        const iddpto = document.getElementById('proyectoIDDpto').value;
        const iding = document.getElementById('proyectoIDIng').value;
        const response = await fetch('/api/proyectos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, fec_inicio, fec_termino, iddpto, iding })
        });
        if (response.ok) {
            alert('Proyecto creado');
            loadProyectos();
        } else {
            alert('Error al crear proyecto');
        }
    });

    const loadDepartamentos = async () => {
        const response = await fetch('/api/departamentos');
        const departamentos = await response.json();
        const list = document.getElementById('departamentosList');
        list.innerHTML = departamentos.map(d => `<p>${d.Nombre} (Tel: ${d.Telefono}, Fax: ${d.Fax})</p>`).join('');
        const select = document.getElementById('proyectoIDDpto');
        select.innerHTML = '<option value="">Selecciona un Departamento</option>';
        select.innerHTML += departamentos.map(d => `<option value="${d.IDDpto}">${d.Nombre}</option>`).join('');
    };

    const loadIngenieros = async () => {
        const response = await fetch('/api/ingenieros');
        const ingenieros = await response.json();
        const list = document.getElementById('ingenierosList');
        list.innerHTML = ingenieros.map(i => `<p>${i.Especialidad} - ${i.Cargo}</p>`).join('');
        const select = document.getElementById('proyectoIDIng');
        select.innerHTML = '<option value="">Selecciona un Ingeniero</option>';
        select.innerHTML += ingenieros.map(i => `<option value="${i.IDIng}">${i.Especialidad}</option>`).join('');
    };

    const loadProyectos = async () => {
        const response = await fetch('/api/proyectos');
        const proyectos = await response.json();
        const list = document.getElementById('proyectosList');
        list.innerHTML = proyectos.map(p => `<p>${p.Nombre} (Inicio: ${p.Fec_Inicio}, Termino: ${p.Fec_Termino})</p>`).join('');
    };

    loadDepartamentos();
    loadIngenieros();
    loadProyectos();
});
