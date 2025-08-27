import React, { Component } from "react";
import { X, Save } from "lucide-react";

class ItemForm extends Component {
  constructor(props) {
    super(props);

    // Estado inicial del formulario
    this.state = {
      name: "",
      description: "",
    };
  }

  // Se ejecuta cuando el componente recibe nuevas props
  componentDidUpdate(prevProps) {
    // Si se abrió el formulario o cambió el item
    if (this.props.isOpen && !prevProps.isOpen) {
      if (this.props.item) {
        // Editar: llenar con datos del item
        this.setState({
          name: this.props.item.name || "",
          description: this.props.item.description || "",
        });
      } else {
        // Crear: limpiar formulario
        this.setState({
          name: "",
          description: "",
        });
      }
    }
  }

  // Manejar cambios en los inputs
  handleNameChange = (e) => {
    this.setState({ name: e.target.value });
  };

  handleDescriptionChange = (e) => {
    this.setState({ description: e.target.value });
  };

  // Manejar envío del formulario
  handleSubmit = (e) => {
    e.preventDefault();

    if (!this.state.name.trim()) {
      alert("El nombre es requerido");
      return;
    }

    // Enviar datos al componente padre
    this.props.onSave({
      name: this.state.name,
      description: this.state.description,
    });

    // Limpiar formulario
    this.setState({
      name: "",
      description: "",
    });
  };

  render() {
    // Si el formulario no está abierto, no mostrar nada
    if (!this.props.isOpen) return null;

    const { item, onCancel } = this.props;
    const { name, description } = this.state;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {item ? "Editar Item" : "Nuevo Item"}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={this.handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={name}
                onChange={this.handleNameChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Ingrese el nombre del item"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={this.handleDescriptionChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Descripción opcional"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Save size={18} />
                <span>Guardar</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default ItemForm;
