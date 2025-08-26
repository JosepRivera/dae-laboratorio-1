import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { itemService } from "../services/itemService";
import ItemCard from "./ItemCard";
import ItemForm from "./ItemForm";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Cargar items al montar el componente
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await itemService.getAll();

      if (response.success) {
        setItems(response.items);
      } else {
        setError("Error al cargar los items");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSave = async (formData) => {
    try {
      if (editingItem) {
        // Actualizar item existente
        const response = await itemService.update(editingItem.id, formData);
        if (response.success) {
          setItems(
            items.map((item) =>
              item.id === editingItem.id ? response.item : item
            )
          );
          setShowForm(false);
          setEditingItem(null);
        }
      } else {
        // Crear nuevo item
        const response = await itemService.create(formData);
        if (response.success) {
          setItems([...items, response.item]);
          setShowForm(false);
        }
      }
    } catch (err) {
      throw new Error(err.response?.data?.error || "Error al guardar");
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este item?")) {
      return;
    }

    try {
      const response = await itemService.delete(itemId);
      if (response.success) {
        setItems(items.filter((item) => item.id !== itemId));
      }
    } catch (err) {
      setError("Error al eliminar el item");
      console.error("Error:", err);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

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
        <div className="flex space-x-3">
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            <span>Nuevo Item</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            No hay items disponibles
          </div>
          <button
            onClick={handleCreate}
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
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ItemForm
        item={editingItem}
        onSave={handleSave}
        onCancel={handleCancel}
        isOpen={showForm}
      />
    </div>
  );
};

export default ItemList;
