import React, { useEffect, useState } from "react";
import Gelato from "./Gelato";
import axios from "axios";
import data from "../fakeData";

const url = "https://react--course-api.herokuapp.com/api/v1/data/gelateria";


const Menu = () => {

  // Controlli stato API
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // Dati vari
  const [prodotti, setProdotti] = useState(data);
  const [selected, setSelected] = useState(0);
  const [filterProduct, setFilterProduct] = useState(prodotti);
  const [categorie, setCategorie] = useState([])

  // Filtra prodotti al click
  const filtraProdotti = (categoria, index) => {

    setSelected(index)
    if (categoria === "all") {
      setFilterProduct(prodotti);

    } else {
      setFilterProduct(prodotti.filter(prodotto => (prodotto.categoria === categoria ? prodotto : "")))
    }
  }

  // Al caricamento della pagina
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setIsError(false);

      // Chiamata APi
      try {
        const response = await axios.get(url);
        setProdotti(response.data.data)
        setFilterProduct(response.data.data)

        // Estrapolazione categoria
        const nuoveCategorie = Array.from(new Set(response.data.data.map(prodotto => prodotto.categoria)))
        nuoveCategorie.unshift("all");
        setCategorie(nuoveCategorie);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        setIsError(true);
      }
    })()

  }, [])

  return <div className="container">
    <h3 style={{ textAlign: "center" }}>
      Le nostre scelte
    </h3>
    {
      // No loading or error
      !isLoading && !isError
        ? <>
          <div className="lista-categorie">
            {categorie.map((categoria, index) => {
              return <button key={index}
                onClick={() => filtraProdotti(categoria, index)}
                className={`btn btn-selector ${index === selected && "active"}`}>
                {categoria}
              </button>
            })}
          </div>

          <div className="vetrina">
            {filterProduct.map(prodotto => <Gelato key={prodotto.id} {...prodotto} />)}
          </div>
        </>
        // Error
        :
        !isLoading && isError ? (
          <h4
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            Errore...
          </h4>
        ) // Loading
          : (
            <h4
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              Loading...
            </h4>
          )
    }

  </div>;
};

export default Menu;
