import { FC, useState, useEffect } from "react";
import reqresAPI from "../api/regres_api";
import { ProductsListData } from '../ProductList';
import './../scss/modal.scss';
import './../scss/app.scss';
import { TextField } from "@mui/material";


const ProductsList: FC = () => {
    const [data, setData] = useState<ProductsListData[]>();
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [modal, setModal] = useState(false);
    const [modalId, setModalId] = useState(0);
    const [findId, setFindId] = useState(0);
    const [dataWithId, setDataWithId] = useState<ProductsListData>();
    const [error, setError] = useState(null);

    const toggleModal = (e: any) => {
        setModal(!modal);
        setModalId(e.target.id);
    };

    const handleChange = (e: any) => {
        setFindId(parseInt(e.target.value));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await reqresAPI.get(`/products?page=${page}&per_page=5`);
                if (findId > 0 && findId <= totalItems) {
                    const responseWithId = await reqresAPI.get(`/products?id=${findId}`);
                    setDataWithId(responseWithId.data.data);
                }
                setData(response.data.data);
                setLastPage(response.data.total_pages);
                setTotalItems(response.data.total);
            } catch (error: any) {
                setError(error.message);
            }

        }
        fetchData();

    }, [findId, page, modal, lastPage, modalId, totalItems]);

    if (error != null) {
        return (
            <div>{error}</div>
        )
    }

    if (data === undefined) {
        return (
            <div>Loading data...</div>
        );
    }

    if (findId <= 0 || Number.isNaN(findId)) {
        return (
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Search by Id"
                        onChange={handleChange}
                        type='number'
                    />
                </form>
                <ul>
                    {data.map((item, index) => {
                        return (
                            <li
                                onClick={toggleModal}
                                id={index.toString()}
                                key={item.id}
                                style={{ backgroundColor: item.color }}
                            >
                                <span onClick={toggleModal} id={index.toString()}>Id: {item.id}</span>
                                <span onClick={toggleModal} id={index.toString()}>Name: {item.name}</span>
                                <span onClick={toggleModal} id={index.toString()}>Year: {item.year}</span>
                            </li>
                        )
                    })}
                </ul>
                {modal && (
                    <div className="modal">
                        <div onClick={toggleModal} className="overlay"></div>
                        <div className="modal-content">
                            <span>Id: {data[modalId].id}</span>
                            <span>Color: {data[modalId].color}</span>
                            <span>Name: {data[modalId].name}</span>
                            <span>Pantone value: {data[modalId].pantone_value}</span>
                            <span>Year: {data[modalId].year}</span>
                            <button className="close-modal" onClick={toggleModal}>X</button>
                        </div>
                    </div>
                )}
                <div className="btnContainer">
                    <button onClick={() => { return (page > 1 ? setPage(page - 1) : page) }}>Previous</button>
                    <button onClick={() => { return (page < lastPage ? setPage(page + 1) : page) }}>Next</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Search by Id"
                    onChange={handleChange}
                    type='number'
                    /*value={findId}*/
                />
            </form>
            <ul>
                {<li
                    id={dataWithId?.id.toString()}
                    onClick={toggleModal}
                    style={{ backgroundColor: dataWithId?.color }}
                >
                    <span>Id: {dataWithId?.id}</span>
                    <span>Name: {dataWithId?.name}</span>
                    <span>Year: {dataWithId?.year}</span>
                </li>}
            </ul>
            {modal && (
                <div className="modal">
                    <div onClick={toggleModal} className="overlay"></div>
                    <div className="modal-content">
                        <span>Id: {dataWithId?.id}</span>
                        <span>Color: {dataWithId?.color}</span>
                        <span>Name: {dataWithId?.name}</span>
                        <span>Pantone value: {dataWithId?.pantone_value}</span>
                        <span>Year: {dataWithId?.year}</span>
                        <button className="close-modal" onClick={toggleModal}>X</button>
                    </div>
                </div>
            )}
            <div className="btnContainer">
                <button onClick={() => { return (findId > 1 ? setFindId(findId - 1) : findId) }}>Previous</button>
                <button onClick={() => { return (findId < totalItems ? setFindId(findId + 1) : findId) }}>Next</button>
            </div>
        </div>
    );
};

export default ProductsList;
