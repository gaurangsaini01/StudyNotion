import React from 'react'

function ListOfCategories({ list }) {
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
                                <button>Delete</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ListOfCategories