import React, { useEffect, useRef, useState } from 'react'
import { createImageURL } from '../common/utils';
import Modal from './modal'
import Youtube from 'react-youtube'
import { fetchRequest } from '../common/api';
import { ENDPOINT } from '../common/endpoints';
const CARD_WIDTH = 200;
import PlayIcon from '@heroicons/react/24/solid/PlayCircleIcon'
import LikeIcon from '@heroicons/react/24/outline/HandThumbUpIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import ChevronDown from '@heroicons/react/24/outline/ChevronDownIcon'
import { Position } from '../common/types';

export type MovieVideoResult<T> = {
    id: number
    results: T;
    [k: string]: unknown;
}

export type MovieVideoInfo = {
    iso_639_1: string
    iso_3166_1: string
    name: string
    key: string
    site: string
    size: number
    type: string
    official: boolean
    published_at: string
    id: string
    [k: string]: unknown
};


type MovieCardProp = {
    id: number;
    title: string;
    poster_path: string;
};


export default function MovieCard({ poster_path, id, title }: MovieCardProp) {
    const [isOpen, setIsOpen] = useState(false);
    const [videoInfo, setVideoInfo] = useState<MovieVideoInfo | null>(null);
    const movieCardRef = useRef<HTMLSelectElement>(null);
    const [position,setPosition] = useState<Position | null >(null);

    async function fetchVideoInfo() {
        // fetch video info
        const response = await fetchRequest<MovieVideoResult<MovieVideoInfo[]>>(
            ENDPOINT.MOVIES_VIDEO.replace("{movie_id}", id.toString())
        );
        return response.results.filter(
            result => result.site.toLowerCase() === "youtube");
    }

    async function onMouseEnter(event: any) {
        const [videoInfo] = await fetchVideoInfo();
        let  calculatedPosition = movieCardRef.current?.getBoundingClientRect();
        console.log({calculatedPosition});
        let top = calculatedPosition?.top ?? 0  - 100;
        let left = calculatedPosition?.left ?? 0 - 100;
        setPosition({top,left});
        setVideoInfo(videoInfo);
        setIsOpen(true);
    }

    useEffect(() => {
        movieCardRef.current?.addEventListener("mouseenter", onMouseEnter);
        () => movieCardRef.current?.removeEventListener('mouseenter', onMouseEnter)
    }, [])
    function onClose(value: boolean) {
        setIsOpen(value);
    }
    function closeModal() {
        setIsOpen(false);
    }
    return (

        <>
            <section
                ref={movieCardRef}
                key={id}
                className='aspect-square flex-none overflow-hidden rounded-md'
            >
                <img
                    loading='lazy'
                    className='h-full w-full'
                    src={createImageURL(poster_path, CARD_WIDTH)}
                    alt={title}
                />
            </section>
            <Modal title={""} isOpen={isOpen} key={id} onClose={onClose} closeModal={closeModal} position={position} >
                <section>
                    <Youtube opts={
                        {
                            width: "450",
                            playerVars: {
                                autoplay: 1,
                                playsinline: 1,
                                controls: 0,
                            }
                        }
                    } videoId={videoInfo?.key} />

                    <section className='flex items-center justify-between p-6'>
                        <ul className='flex items-center justify-evenly gap-4'>
                            <li className='h-12 w-12'>
                                <button className='h-full w-full '>
                                    <PlayIcon></PlayIcon>
                                </button>
                            </li>
                            <li className='h-12 w-12 rounded-full border-2 border-gray-500 p-2 hover:border-white'>
                                <button className='h-full w-full '>
                                    <PlusIcon />
                                </button>
                            </li>
                            <li className='h-12 w-12 rounded-full border-2 border-gray-500 p-2 hover:border-white'>
                                <button className='h-full w-full'>
                                    <LikeIcon />
                                </button>
                            </li>
                        </ul>
                        <ul className='flex items-center justify-evenly gap-4'>
                            <li className='h-12 w-12 rounded-full border-2 border-gray-500 p-2 hover:border-white'>
                                <button className='h-full w-full'>
                                    <ChevronDown />
                                </button>
                            </li>
                        </ul>
                    </section>
                </section>
            </Modal>
        </>
    )
}
