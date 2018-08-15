import React, { Component } from 'react';
import 'isomorphic-fetch'
import { Link } from '../routes'
import slug from '../helpers/slug'
import Layout from '../components/Layout'
import Error from './_error'

export default class extends React.Component {

  static async getInitialProps ({ query, res }) {
    let { id } = query;
    try {
      const fetchClip = await fetch(`https://api.audioboom.com/audio_clips/${id}.mp3`);
      if( fetchClip.status >= 400 ) {
        res.statusCode = fetchClip.status
        return { clip: null, statusCode: fetchClip.status }
      }
      const clip = (await fetchClip.json()).body.audio_clip
      return { clip, statusCode: 200 }
    } catch(e) {
      return { clip: null, statusCode: 503 }
    }
  }

  render() {
    const { clip, statusCode } = this.props

    if( statusCode !== 200 ) {
      return <Error statusCode={ statusCode } />
    }
    
    return <Layout title={clip.title}>
      <div className='modal'>
        <div className='clip'>
          <nav>
            <Link route='channel' 
              params={{ slug: slug(clip.channel.title), id: clip.channel.id }} 
              prefetch>
              <a className='close'>&lt; Volver</a>
            </Link>
          </nav>

          <picture>
            <div style={{ backgroundImage: `url(${clip.urls.image || clip.channel.urls.logo_image.original})` }} />
          </picture>

          <div className='player'>
            <h3>{ clip.title }</h3>
            <h6>{ clip.channel.title }</h6>
            <audio controls autoPlay={true}>
              <source src={clip.urls.high_mp3} type='audio/mpeg' />
            </audio>
          </div>
        </div>
      </div>

      <style jsx>{`
        nav {
          background: none;
        }
        nav a {
          display: inline-block;
          padding: 15px;
          color: white;
          cursor: pointer;
          text-decoration: none;
        }
        .clip {
          display: flex;
          height: 100%;
          flex-direction: column;
          background: #8756ca;
          color: white;
        }
        picture {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1 1;
          flex-direction: column;
          width: auto;
          padding: 10%;
        }
        picture div {
          width: 100%;
          height: 100%;
          background-position: 50% 50%;
          background-size: contain;
          background-repeat: no-repeat;
        }
        .player {
          padding: 30px;
          background: rgba(0,0,0,0.3);
          text-align: center;
        }
        h3 {
          margin: 0;
        }
        h6 {
          margin: 0;
          margin-top: 1em;
        }
        audio {
          margin-top: 2em;
          width: 100%;
        }

        .modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 99999;
        }
      `}</style>
    </Layout>
  }
}