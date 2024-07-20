import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categorie({ swal }) {
  const [editedCategorie, setEditedCategorie] = useState(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategorie, setParentCategorie] = useState("");
  const [propreties, setPropreties] = useState([]);

  function fetchCategorie() {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }
  async function saveCategories(e) {
    e.preventDefault();
    const data = {
      name,
      parentCategorie,
      propreties: propreties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    if (editedCategorie) {
      data._id = editedCategorie._id;
      await axios.put("/api/categories", data);
      setEditedCategorie(null);
    } else {
      await axios.post("/api/categories", data);
    }
    setName("");
    setParentCategorie("");
    setPropreties([]);
    fetchCategorie();
  }

  useEffect(() => {
    fetchCategorie();
  }, []);

  function editCategory(category) {
    setEditedCategorie(category);
    setName(category.name);
    setParentCategorie(category.parent?._id);
    setPropreties(
      category.propreties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }
  function deleCategory(category) {
    swal
      .fire({
        title: "Are you sure ?",
        text: `You want to delete ${category.name}`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, delete !",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategorie();
        }
      });
  }

  function addProprety() {
    setPropreties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function handlePropretyNameChange(index, proprety, newName) {
    setPropreties((prev) => {
      const propreties = [...prev];
      propreties[index].name = newName;
      return propreties;
    });
  }

  function handlePropretyValuesChange(index, proprety, newValues) {
    setPropreties((prev) => {
      const propreties = [...prev];
      propreties[index].values = newValues;
      return propreties;
    });
  }

  function removeProprety(indexToRemove) {
    setPropreties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategorie
          ? `Edit category ${editedCategorie.name}`
          : "Create new category"}
      </label>
      <form onSubmit={saveCategories}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={"Category name"}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            value={parentCategorie}
            onChange={(e) => setParentCategorie(e.target.value)}
          >
            <option value="">No parent Categorie</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option value={category._id}>{category.name}</option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Proprieties</label>
          <button
            type="button"
            className="btn-default text-sm mb-2"
            onClick={addProprety}
          >
            Add new propreties
          </button>
          {propreties.length > 0 &&
            propreties.map((proprety, index) => (
              <div className="flex gap-1 mb-2">
                <input
                  type="text"
                  placeholder="proprety name (example : color)"
                  value={proprety.name}
                  className="mb-0"
                  onChange={(ev) =>
                    handlePropretyNameChange(index, proprety, ev.target.value)
                  }
                />
                <input
                  type="text"
                  value={proprety.values}
                  placeholder="value"
                  className="mb-0"
                  onChange={(ev) =>
                    handlePropretyValuesChange(index, proprety, ev.target.value)
                  }
                />
                <button
                  className="btn-red"
                  onClick={() => removeProprety(index)}
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editedCategorie && (
            <button
              type="button"
              className="btn-default"
              onClick={() => {
                setEditedCategorie(null);
                setName("");
                setParentCategorie("");
                setPropreties([]);
              }}
            >
              {" "}
              Cancel{" "}
            </button>
          )}

          <button className="btn-primary py-1" type="submit">
            Save
          </button>
        </div>
      </form>
      {!editedCategorie && (
        <table className="basic mt-4">
          <thead>
            <tr>
              <td>Categories name</td>
              <td>Parent Categorie</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr>
                  <td>{category.name}</td>
                  <td> {category?.parent?.name}</td>
                  <td>
                    <button
                      className="btn-default mr-1"
                      onClick={() => editCategory(category)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-red"
                      onClick={() => deleCategory(category)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal, ref }) => <Categorie swal={swal} />);
