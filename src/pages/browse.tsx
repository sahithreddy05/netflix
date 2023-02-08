import React, { useEffect } from 'react'
import { fetchRequest, MovieResponse, MovieResult } from '../common/api'
import { ENDPOINT } from '../common/endpoints'
import ContentRow from '../components/content-rows'

export default function Browse() {

    
    return (<section>
        <section>
            Banner Image
        </section>
        <ContentRow endpoint={ENDPOINT.MOVIES_POPULAR} title='New & Popular' />
        <ContentRow endpoint={ENDPOINT.MOVIES_TOP_RATED} title='Top Rated' />
        <ContentRow endpoint={ENDPOINT.MOVIES_NOW_PLAYING} title='Now Playing' />
    </section>)
}
