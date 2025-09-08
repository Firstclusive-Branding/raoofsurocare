import React, { useEffect, useState } from "react";
import "../styles/AdminPolicies.css";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_PUBLIC_API_URL;

const AdminPolicies = () => {
  const [policiesData, setPoliciesData] = useState([]);
  const [docId, setDocId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSectionEditOpen, setIsSectionEditOpen] = useState(false);

  const [sectionEditData, setSectionEditData] = useState({
    sectionId: "",
    newSection: "",
  });

  const [newPolicy, setNewPolicy] = useState({
    sectionId: "",
    sectionName: "",
    title: "",
    value: "",
    itemId: "",
    isEdit: false,
    isAddOnlyItem: false,
  });

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseURL}/api/admin/privacypolicy`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.data?.[0];
      setPoliciesData(data?.privacypolicy || []);
      setDocId(data?._id || "");
    } catch (err) {
      console.error("Error fetching policies:", err);
      toast.error("Failed to load privacy policies.");
    }
  };

  const handleAddOrUpdate = async () => {
    const {
      sectionId,
      sectionName,
      title,
      value,
      itemId,
      isEdit,
      isAddOnlyItem,
    } = newPolicy;
    const token = localStorage.getItem("token");

    const result = await Swal.fire({
      title: "Confirm Save",
      text: "Are you sure you want to save this?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Save",
    });

    if (!result.isConfirmed) return;

    try {
      if (isEdit) {
        // Update item
        await axios.put(
          `${baseURL}/api/admin/privacypolicy/update/${docId}/${sectionId}/${itemId}`,
          { title, value },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Policy updated successfully!");
      } else if (isAddOnlyItem) {
        // Add new item in existing section
        await axios.post(
          `${baseURL}/api/admin/privacypolicy/${docId}/additems/${sectionId}`,
          { section: sectionId, items: [{ title, value }] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Policy item added successfully!");
      } else {
        // Add new section with item
        await axios.post(
          `${baseURL}/api/admin/privacypolicy/${docId}/addsection`,
          { section: sectionName, items: [{ title, value }] },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("New policy section created!");
      }

      setIsModalOpen(false);
      resetForm();
      fetchPolicies();
    } catch (err) {
      console.error("Error saving policy:", err);
      toast.error("Failed to save. Check the API or form data.");
    }
  };

  const handleDeleteItem = async (sectionIndex, itemIndex) => {
    const section = policiesData[sectionIndex];
    const itemId = section.items[itemIndex]._id;
    const token = localStorage.getItem("token");

    const confirm = await Swal.fire({
      title: "Confirm Delete",
      text: "Are you sure you want to delete this item?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(
        `${baseURL}/api/admin/privacypolicy/${docId}/deleteitem/${section._id}/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Item deleted successfully!");
      fetchPolicies();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete item.");
    }
  };

  const handleDeleteSection = async (sectionId) => {
    const token = localStorage.getItem("token");

    const confirm = await Swal.fire({
      title: "Confirm Delete Section",
      text: "This will delete the entire section and its items. Continue?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(
        `${baseURL}/api/admin/privacypolicy/${docId}/deletesection/${sectionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Section deleted successfully!");
      fetchPolicies();
    } catch (err) {
      console.error("Error deleting section:", err);
      toast.error("Failed to delete section.");
    }
  };

  const handleEdit = (sectionIndex, itemIndex) => {
    const section = policiesData[sectionIndex];
    const item = section.items[itemIndex];
    setNewPolicy({
      sectionId: section._id,
      sectionName: section.section,
      title: item.title,
      value: item.value,
      itemId: item._id,
      isEdit: true,
      isAddOnlyItem: false,
    });
    setIsModalOpen(true);
  };

  const handleAddItemToSection = (sectionId) => {
    const section = policiesData.find((s) => s._id === sectionId);
    setNewPolicy({
      sectionId,
      sectionName: section.section,
      title: "",
      value: "",
      itemId: "",
      isEdit: false,
      isAddOnlyItem: true,
    });
    setIsModalOpen(true);
  };

  const handleSectionRename = async () => {
    const token = localStorage.getItem("token");

    const confirm = await Swal.fire({
      title: "Rename Section?",
      text: "Are you sure you want to update the section name?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.put(
        `${baseURL}/api/admin/privacypolicy/updatesection/${docId}/${sectionEditData.sectionId}`,
        { newsection: sectionEditData.newSection },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Section name updated!");
      setIsSectionEditOpen(false);
      setSectionEditData({ sectionId: "", newSection: "" });
      fetchPolicies();
    } catch (err) {
      console.error("Rename failed:", err);
      toast.error("Failed to rename section.");
    }
  };

  const resetForm = () => {
    setNewPolicy({
      sectionId: "",
      sectionName: "",
      title: "",
      value: "",
      itemId: "",
      isEdit: false,
      isAddOnlyItem: false,
    });
  };

  return (
    <div className="policies-container">
      <div className="policies-header">
        <h2 className="policies-title">Manage Privacy Policy</h2>
        <button
          className="policies-btn-add-section"
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <FaPlus /> Add Section with Item
        </button>
      </div>

      {policiesData.map((section, sectionIndex) => (
        <div key={section._id} className="policies-section">
          <h3 className="policies-section-title">
            {section.section}
            <div className="policies-section-controls">
              <button
                className="policies-btn policies-btn-rename"
                onClick={() => {
                  setSectionEditData({
                    sectionId: section._id,
                    newSection: section.section,
                  });
                  setIsSectionEditOpen(true);
                }}
              >
                <FaEdit /> Rename
              </button>
              <button
                className="policies-btn policies-btn-delete"
                onClick={() => handleDeleteSection(section._id)}
              >
                <FaTrashAlt /> Delete
              </button>
              <button
                className="policies-btn policies-btn-add"
                onClick={() => handleAddItemToSection(section._id)}
              >
                <FaPlus /> Add Item
              </button>
            </div>
          </h3>

          {section.items.map((item, itemIndex) => (
            <div key={item._id} className="policies-item">
              {item.title && (
                <div className="policies-item-title">{item.title}</div>
              )}
              <div className="policies-item-desc">
                {item.value.split("\n").map((line, idx) => {
                  if (
                    line.trim().startsWith("*") ||
                    line.trim().startsWith("-")
                  ) {
                    return <li key={idx}>{line.replace(/^[-*]\s*/, "")}</li>;
                  }
                  return <p key={idx}>{line}</p>;
                })}
              </div>
              <div className="policies-item-actions">
                <FaEdit onClick={() => handleEdit(sectionIndex, itemIndex)} />
                <FaTrashAlt
                  onClick={() => handleDeleteItem(sectionIndex, itemIndex)}
                />
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="policies-modal-overlay">
          <div className="policies-modal">
            <h3>
              {newPolicy.isEdit
                ? "Edit Policy"
                : newPolicy.isAddOnlyItem
                ? "Add Item to Section"
                : "Add Section"}
            </h3>
            {!newPolicy.isAddOnlyItem && !newPolicy.isEdit && (
              <input
                className="policies-input"
                type="text"
                placeholder="Section Name"
                value={newPolicy.sectionName}
                onChange={(e) =>
                  setNewPolicy({ ...newPolicy, sectionName: e.target.value })
                }
              />
            )}

            <span>(For sub-points use dash -)</span>
            <textarea
              className="policies-textarea"
              placeholder="Description"
              value={newPolicy.value}
              onChange={(e) =>
                setNewPolicy({ ...newPolicy, value: e.target.value })
              }
            ></textarea>
            <div className="policies-modal-actions">
              <button className="policies-btn-save" onClick={handleAddOrUpdate}>
                Save
              </button>
              <button
                className="policies-btn-cancel"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Rename Modal */}
      {isSectionEditOpen && (
        <div className="policies-modal-overlay">
          <div className="policies-modal">
            <h3>Edit Section Name</h3>
            <input
              className="policies-input"
              type="text"
              value={sectionEditData.newSection}
              onChange={(e) =>
                setSectionEditData({
                  ...sectionEditData,
                  newSection: e.target.value,
                })
              }
            />
            <div className="policies-modal-actions">
              <button
                className="policies-btn-save"
                onClick={handleSectionRename}
              >
                Update
              </button>
              <button
                className="policies-btn-cancel"
                onClick={() => {
                  setIsSectionEditOpen(false);
                  setSectionEditData({ sectionId: "", newSection: "" });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPolicies;
