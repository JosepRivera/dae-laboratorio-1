import React from "react";
import { Edit, Trash2 } from "lucide-react";

const ItemCard = ({ item, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {item.description && (
        <p className="text-gray-600 mb-4">{item.description}</p>
      )}

      <div className="text-sm text-gray-400">
        Creado: {new Date(item.created_at).toLocaleDateString()}
      </div>
    </div>
  );
};

export default ItemCard;
