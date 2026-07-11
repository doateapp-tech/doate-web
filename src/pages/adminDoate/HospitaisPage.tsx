import { useEffect, useState } from "react";
import "./HospitaisPage.css";

export default function HospitaisPage() {
  const [hospitais, setHospitais] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<any | null>(null);

  const token = localStorage.getItem("token");

  const fetchHospitais = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/hospitais`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setHospitais(data);

    } catch (err) {
      console.error("Erro ao buscar hospitais:", err);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitais();
  }, []);

  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/hospitais/${editando.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editando),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setEditando(null);
      fetchHospitais();

    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "Tens certeza que queres desativar este hospital?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/hospitais/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchHospitais();

    } catch (err) {
      console.error("Erro ao desativar:", err);
    }
  };

  if (loading) {
    return (
      <div className="hospitais-container">
        <p>Carregando hospitais...</p>
      </div>
    );
  }

  return (
    <div className="hospitais-container">

      {/* HEADER */}
      <div className="hospitais-header">

        <div>
          <h2>Gestão de Hospitais</h2>

          <p>
            Gerencie hospitais registados na plataforma DOATE.
          </p>
        </div>

      </div>

      {/* TABELA */}
      <div className="hospitais-table-wrapper">

        <table>

          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Localização</th>
              <th>Coordenadas</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>

            {hospitais.map((hospital) => (
              <tr key={hospital.id}>

                <td>
                  <strong>{hospital.nome}</strong>
                </td>

                <td>{hospital.email}</td>

                <td>
                  {hospital.provincia} / {hospital.municipio}
                </td>

                <td>
                  {hospital.latitude && hospital.longitude ? (
                    <div>
                      <div>Lat: {hospital.latitude}</div>
                      <div>Lng: {hospital.longitude}</div>
                    </div>
                  ) : (
                    <span className="no-coord">
                      Não definido
                    </span>
                  )}
                </td>

                <td>
                  <div className="actions">

                    <button
                      className="edit"
                      onClick={() => setEditando(hospital)}
                    >
                      Editar
                    </button>

                    <button
                      className="delete"
                      onClick={() => handleDelete(hospital.id)}
                    >
                      Desativar
                    </button>

                  </div>
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* MODAL */}
      {editando && (
        <div className="modal">

          <div className="modal-content">

            <h3>Editar Hospital</h3>

            <input
              type="text"
              value={editando.nome}
              onChange={(e) =>
                setEditando({
                  ...editando,
                  nome: e.target.value,
                })
              }
              placeholder="Nome do hospital"
            />

            <input
              type="text"
              value={editando.provincia || ""}
              onChange={(e) =>
                setEditando({
                  ...editando,
                  provincia: e.target.value,
                })
              }
              placeholder="Província"
            />

            <input
              type="text"
              value={editando.municipio || ""}
              onChange={(e) =>
                setEditando({
                  ...editando,
                  municipio: e.target.value,
                })
              }
              placeholder="Município"
            />

            <input
              type="number"
              value={editando.latitude || ""}
              onChange={(e) =>
                setEditando({
                  ...editando,
                  latitude: e.target.value,
                })
              }
              placeholder="Latitude"
            />

            <input
              type="number"
              value={editando.longitude || ""}
              onChange={(e) =>
                setEditando({
                  ...editando,
                  longitude: e.target.value,
                })
              }
              placeholder="Longitude"
            />

            <div className="modal-actions">

              <button
                className="edit"
                onClick={handleUpdate}
              >
                Salvar
              </button>

              <button
                className="delete"
                onClick={() => setEditando(null)}
              >
                Cancelar
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}