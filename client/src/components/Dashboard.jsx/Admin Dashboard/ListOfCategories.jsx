import React, { useState } from 'react'
import { deleteCategory } from '../../../services/operations/category'
import { useSelector } from 'react-redux'
import ConfirmationModal from '../../reusable/Confirmationmodal';

function ListOfCategories({ list, setList }) {
    const { token } = useSelector(state => state.auth);
    const [open, setOpen] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState(null);
    function handleDelete(categoryId) {
        setOpen(true);
        setConfirmationModal({
            text1: "Are You Sure ?",
            text2: "All Courses in this category will be deleted.",
            btn1Text: "Delete",
            btn2Text: "Cancel",
            btn1Handler: () => {
                deleteCategory(categoryId, token);
                setList(prev => {
                    return prev.filter((c) => c._id !== categoryId)
                })
                setOpen(false)
                setConfirmationModal(null)
            },
            btn2Handler: () => setConfirmationModal(null),
        });

    }
    return (
        <>
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
            {
                confirmationModal && <ConfirmationModal
                    open={open}
                    handleClose={() => setOpen(false)}
                    modalData={confirmationModal}
                />
            }
        </>

    )
}

export default ListOfCategories