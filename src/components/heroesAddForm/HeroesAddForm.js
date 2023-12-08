import {useHttp} from '../../hooks/http.hook';
import {useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { heroesCreated } from '../heroesList/heroesSlice';
import { v4 as uuidv4 } from 'uuid';
import store from '../../store';
import {selectAll} from '../heroesFilters/filtersSlice';


const HeroesAddForm = () => {

    const [nameHero, setNameHero] = useState('');
    const [textHero, setTextHero] = useState('');
    const [elementHero, setElementHero] = useState('');

    const {filtersLoadingStatus} = useSelector(state => state.filters);
    const filters = selectAll(store.getState());
    const dispatch = useDispatch();
    const {request} = useHttp();

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const newHero = {
            id: uuidv4(),
            name: nameHero,
            description: textHero,
            element: elementHero
        }

        request("http://localhost:3001/heroes", "POST", JSON.stringify(newHero))
            .then(res => console.log(res, 'Отправка успешна'))
            .then(dispatch(heroesCreated(newHero)))
            .catch(err => console.log(err));

        setNameHero('');
        setTextHero('');
        setElementHero('');
    }


    const renderFilters = (filters, status) => {
        if (status === "loading") {
            return <option>Загрузка элементов</option>
        } else if (status === "error") {
            return <option>Ошибка загрузки</option>
        }
        
        if (filters && filters.length > 0 ) {
            return filters.map(({name, label}) => {

                // eslint-disable-next-line
                if (name === 'all')  return;

                return <option key={name} value={name}>{label}</option>
            })
        }
    }



    return (
        <form onSubmit={onSubmitHandler} className="border p-4 shadow-lg rounded">
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">New hero's name</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="What is my name?"
                    value={nameHero}
                    onChange={(e) => setNameHero(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Description</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="What can I do?"
                    style={{"height": '130px'}}
                    value={textHero}
                    onChange={(e) => setTextHero(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Select hero element</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={elementHero}
                    onChange={(e) => setElementHero(e.target.value)}>
                    <option >I own the element...</option>
                    {renderFilters(filters, filtersLoadingStatus)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Create</button>
        </form>
    )
}

export default HeroesAddForm;