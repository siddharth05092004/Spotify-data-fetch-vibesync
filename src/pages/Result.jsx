import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import SongRow from "../components/SongRow.jsx";
import Loading from '../components/Loading.jsx';


function Result() {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const [track_data_show, set_track_data_show] = useState([]);
  

  useEffect(() => {
    starter_function();
  }, []);

  async function starter_function() {
    const query = window.location.search.substring(3).replaceAll('%20',' ');
    const spotify_access_token_response = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            btoa(
              import.meta.env.VITE_SPOTIFY_CLIENT_ID +
                ":" +
                import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
            ),
        },
        body: "grant_type=client_credentials",
      }
    );

    const spotify_access_token = await spotify_access_token_response.json();
    const search_response = await fetch(
      "https://api.spotify.com/v1/search?q=" + query + "&type=track",
      {
        headers: {
          Authorization: "Bearer " + spotify_access_token["access_token"],
        },
      }
    );
    const search_results = await search_response.json();

    const unsorted_track_data = await search_results_get(
      search_results,
      [],
      spotify_access_token
    );

    filter_track_data(unsorted_track_data);
  }

  async function search_results_get(
    search_results,
    unsorted_track_data,
    spotify_access_token
  ) {
    const promises = search_results["tracks"]["items"].map(
      async (key, index) => {
        const res = await get_track_data(
          search_results["tracks"]["items"][index],
          spotify_access_token
        );

        unsorted_track_data.push(res);
      }
    );

    await Promise.all(promises);
    return unsorted_track_data;
  }

  async function get_track_data(track, spotify_access_token) {
    const track_data_response = await fetch(track["href"], {
      headers: {
        Authorization: "Bearer " + spotify_access_token["access_token"],
      },
    });
    const track_data = await track_data_response.json();

    return [
      track_data["album"]["images"][0]["url"],
      track_data["name"],
      track_data["artists"][0]["name"],
      track_data["popularity"],
    ];
  }

  async function filter_track_data(unsorted_track_data) {
    let filtered_track_data = [];
    let track_names = "";

    // console.log(unsorted_track_data);

    await unsorted_track_data.forEach((element,index) => {
      track_names = track_names + index + ":"+ element[1] +'-'+element[2] + " ; ";
    });

    console.log("I am giving you a list of songs and their artist, return the song numbers which are not bhojpuri or haryanvi (check each song using lyrics from youtube), return the numbers separated by space only, recheck your answer by checking lyrics of each song - " +
        track_names)
    
    const gemini_response = await model.generateContent(
      "I am giving you a list of songs and their artist, return the song numbers which are not bhojpuri or haryanvi (check each song using lyrics from youtube), return the numbers separated by space only, recheck your answer by checking lyrics of each song - " +
        track_names
    );
   
    const response = await gemini_response.response;
    const text = response.text();
    // console.log(text);

    text
      .trim()
      .split(" ")
      .forEach((element) => {
        filtered_track_data.push(unsorted_track_data[element]);
      });

    let sorted_track_data = filtered_track_data.sort((a, b) => b[3] - a[3]);
    set_track_data_show(sorted_track_data);
    const loading_animation = document.getElementById("loading_id");
    
    for (let i = 0; i < loading_animation.childNodes.length; i++) {
      loading_animation.childNodes[i].classList.add('hidden')
    }

    
  }

  return (
    <>
      <div className="poppins-regular m-4 grid grid-cols-1 place-items-center grid-items-center">
        <div className="grid grid-cols-1 gap-2 lg:flex lg:justify-center lg:items-center">
          <div className="m-4 lg:m-8 text-2xl lg:text-4xl text-tertiary ">
            Search Results for {window.location.search.substring(3).replaceAll('%20',' ')}
          </div>
          <a href="/" className="flex justify-center items-center">
            <div className="text-lg max-w-36 sm:max-w-full lg:text-2xl text-primary bg-secondary p-2  lg:p-3 transition-all duration-150 hover:opacity-95 hover hover:scale-105 rounded-xl">
              New Search
            </div>
          </a>
        </div>
        <Loading id= "loading_animation" classList="visible"/>
        <div>
          {track_data_show.map((element, index) => {
            if (element) {
              if (index == 0) {
                return (
                  <>
                    <div className="mt-2">
                      <div className="text-xl lg:text-3xl min-h-16 max-h-16 poppins-regular lg:max-w-6xl grid grid-cols-2 text-tertiary   ">
                        <div className="whitespace-nowrap flex">
                          <img src="" className="w-12" alt="" />
                          <div className="p-4 whitespace-nowrap">Track</div>
                        </div>
                        <div className="p-4 gap-4 whitespace-nowrap flex justify-between">
                          <div className="">Artist</div>
                          <div className="line-clamp-1">
                            Popularity (Out of 100)
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <SongRow value={element} key={index} />
                    </div>
                  </>
                );
              } else {
                return (
                  <div className="mt-2">
                    <SongRow value={element} key={index} />
                  </div>
                );
              }
            }
          })}
        </div>
      </div>
    </>
  );
}

export default Result;
