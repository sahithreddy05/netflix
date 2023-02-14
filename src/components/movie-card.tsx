import React, { useEffect, useRef, useState } from 'react'
import { createImageURL } from '../common/utils';
import Modal from './modal'
import Youtube from 'react-youtube'
import { fetchRequest } from '../common/api';
import { ENDPOINT } from '../common/endpoints';
const CARD_WIDTH = 200;

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

    async function fetchVideoInfo() {
        // fetch video info
        const response = await fetchRequest<MovieVideoResult<MovieVideoInfo[]>>(
            ENDPOINT.MOVIES_VIDEO.replace("{movie_id}", id.toString())
        );
        return response.results.filter(
            result => result.site.toLowerCase() === "youtube");
    }

    async function onMouseEnter(event: any) {
        const [videoInfo] = await fetchVideoInfo()
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
            <Modal title={title} isOpen={isOpen} key={id} onClose={onClose}>
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
            </Modal>
        </>
    )
}
