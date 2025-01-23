import React from 'react'
import { deleteCategory } from '../../../services/operations/category'
import { useSelector } from 'react-redux'

function ListOfCategories({ list, setList }) {
    const { token } = useSelector(state => state.auth)

    function handleDelete(categoryId) {
        deleteCategory(categoryId, token);
        setList(prev => {
            return prev.filter((c) => c._id !== categoryId)
        })
    }
    return (
        <div className='text-white w-full md:w-[60%]'>
            <h1 className='font-semibold text-2xl text-yellow-200'>CATEGORIES ARE:</h1>
            <ul className='pl-4 mt-2'>
                {list.map((category) => (
                    <li className='list-disc' key={category._id}>
                        <div className='flex items-center justify-between'>
                            <div>{category.name}</div>
                            <div className='flex gap-4'>
                                <button>Edit</button>
                                <button onClick={() => handleDelete(category._id)}>Delete</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ListOfCategories