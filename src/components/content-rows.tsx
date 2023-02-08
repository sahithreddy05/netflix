import React, { useEffect, useRef, useState } from 'react'
import { fetchRequest, MovieResponse, MovieResult } from '../common/api';
import { ENDPOINT } from '../common/endpoints';
type RowProp = {
    endpoint: string;
    title: string;
}
const CARD_WIDTH = 200;
export default function ContentRows({ title, endpoint }: RowProp) {
    const sliderRef = useRef<HTMLSelectElement>(null);
    const [rowData, setRowData] = useState<MovieResult[]>([]);
    const [translateX, setTranslateX] = useState(0);
    async function fetchRowData() {
        const response = await fetchRequest<MovieResponse<MovieResult[]>>(
            endpoint
        );
        setRowData(response.results);
    }
    useEffect(() => {
        fetchRowData();
    }, []
    )
    function createImageURL(path: string, width: number) {
        return `${import.meta.env.VITE_BASE_IMAGE_URL}/w${width}/${path}`
    }
    function onNextClick() {
        if (sliderRef.current) {
            let updatedTranslateX = translateX - 100;
            sliderRef.current.style.transform = `translateX(${updatedTranslateX}%)`;
            setTranslateX(updatedTranslateX);
        }
    }
    function onPrevClick() {
        if (sliderRef.current) {
            let updatedTranslateX = translateX + 100;
            sliderRef.current.style.transform = `translateX(${updatedTranslateX}%)`;
            setTranslateX(updatedTranslateX);
        }
    }
    return (
        <section className=''>
            <h2 className='mb-4'>{title}</h2>
            <section className='relative flex flex-nowrap gap-2 overflow-hidden'>
                <button
                    className=' absolute h-full bg-black/25 z-[1]'
                    onClick={onPrevClick}
                >prev</button>
                <button
                    className='absolute h-full right-0 z-[1] bg-black/25'
                    onClick={onNextClick}
                >
                    next
                </button>
                <section
                    ref={sliderRef}
                    className=' flex gap-2 transition-transform duration-700 ease-linear' >
                    {rowData?.map(row => {
                        const { id, title, poster_path } = row;
                        return (
                            <section
                                key={id}
                                className='aspect-square flex-none overflow-hidden rounded-md'>
                                <img
                                    loading='lazy'
                                    className='h-full w-full '
                                    src={createImageURL(poster_path, CARD_WIDTH)}
                                    alt={title} />
                            </section>
                        )
                    })}
                </section>
            </section>
        </section>)
}
