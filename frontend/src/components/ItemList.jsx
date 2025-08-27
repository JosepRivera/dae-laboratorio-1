import React, { Component } from "react";
import { Plus } from "lucide-react";
import { itemService } from "../services/itemService";
import ItemCard from "./ItemCard";
import ItemForm from "./ItemForm";

class ItemList extends Component {
  constructor(props) {
    super(props);

    // Estado inicial
    this.state = {
      items: [],
      showForm: false,
      editingItem: null,
      loading: true,
    };
  }

  // Se ejecuta cuando el componente se monta
  componentDidMount() {
    this.loadItems();
  }

  // Cargar items desde la base de datos
  loadItems = async () => {
    try {
      this.setState({ loading: true });
      const response = await itemService.getAll();

      if (response.success) {
        this.setState({ items: response.items });
      } else {
        alert("Error al cargar los items");
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
      console.error("Error:", error);
    } finally {
      this.setState({ loading: false });
    }
  };

  // Función para crear nuevo item
  handleCreate = () => {
    this.setState({
      editingItem: null,
      showForm: true,
    });
  };

  // Función para editar item
  handleEdit = (item) => {
    this.setState({
      editingItem: item,
      showForm: true,
    });
  };

  // Función para guardar item (crear o editar)
  handleSave = async (formData) => {
    try {
      if (this.state.editingItem) {
        // Editar item existente en la base de datos
        const response = await itemService.update(
          this.state.editingItem.id,
          formData
        );

        if (response.success) {
          // Actualizar en el estado local
          this.setState({
            items: this.state.items.map((item) =>
              item.id === this.state.editingItem.id ? response.item : item
            ),
            showForm: false,
            editingItem: null,
          });
        } else {
          alert("Error al actualizar el item");
        }
      } else {
        // Crear nuevo item en la base de datos
        const response = await itemService.create(formData);

        if (response.success) {
          // Agregar al estado local
          this.setState({
            items: [...this.state.items, response.item],
            showForm: false,
            editingItem: null,
          });
        } else {
          alert("Error al crear el item");
        }
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
      console.error("Error:", error);
    }
  };

  // Función para eliminar item
  handleDelete = async (itemId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este item?")) {
      return;
    }

    try {
      const response = await itemService.delete(itemId);

      if (response.success) {
        // Eliminar del estado local
        this.setState({
          items: this.state.items.filter((item) => item.id !== itemId),
        });
      } else {
        alert("Error al eliminar el item");
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
      console.error("Error:", error);
    }
  };

  // Función para cancelar formulario
  handleCancel = () => {
    this.setState({
      showForm: false,
      editingItem: null,
    });
  };

  render() {
    const { items, showForm, editingItem, loading } = this.state;

    // Mostrar loading mientras carga
    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-64">
          <div className="text-xl text-gray-600">Cargando items...</div>
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Items</h1>
          <button
            onClick={this.handleCreate}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            <span>Nuevo Item</span>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              No hay items disponibles
            </div>
            <button
              onClick={this.handleCreate}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear primer item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={this.handleEdit}
                onDelete={this.handleDelete}
              />
            ))}
          </div>
        )}

        <ItemForm
          item={editingItem}
          onSave={this.handleSave}
          onCancel={this.handleCancel}
          isOpen={showForm}
        />
      </div>
    );
  }
}

export default ItemList;
