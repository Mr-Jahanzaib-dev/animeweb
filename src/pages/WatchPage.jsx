import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Download,
  Share2,
  List,
  X,
  ChevronDown,
  Maximize,
  Volume2,
  VolumeX,
  Pause,
  SkipForward,
  SkipBack,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimeCard from "../components/AnimeCard";
import {
  getAnimeInfo,
  getSeasonInfo,
  getEpisodes,
  getEpisodeLinks,
  getPopularAnime,
} from "../services/api";

const WatchPage = () => {
  const { slug, episodeId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [animeData, setAnimeData] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [streamingUrl, setStreamingUrl] = useState("");
  const [streamingType, setStreamingType] = useState("iframe");
  const [loading, setLoading] = useState(true);
  const [showEpisodeList, setShowEpisodeList] = useState(false);
  const [relatedAnime, setRelatedAnime] = useState([]);
  const [otherAnime, setOtherAnime] = useState([]);
  const [displayedRelatedCount, setDisplayedRelatedCount] = useState(12);
  const [displayedOtherCount, setDisplayedOtherCount] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [videoError, setVideoError] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      window.scrollTo({ top: 0, behavior: "smooth" });

      try {
        const anime = await getAnimeInfo(slug);
        setAnimeData(anime);

        const related = await getPopularAnime("month", 1, 24);
        const other = await getPopularAnime("week", 1, 30);

        setRelatedAnime(related.posts || []);
        setOtherAnime(other.posts || []);

        const seasonData = await getSeasonInfo(anime.id);
        const allSeasons = seasonData.seasons || [];
        setSeasons(allSeasons);

        if (allSeasons.length > 0) {
          const firstSeason = allSeasons[0];
          setSelectedSeason(firstSeason);

          const episodeData = await getEpisodes(firstSeason.id);
          setEpisodes(episodeData || []);

          const episode = episodeId
            ? episodeData.find((ep) => ep.id === parseInt(episodeId))
            : episodeData[0];

          setCurrentEpisode(episode);

          if (episode) {
            const links = await getEpisodeLinks(episode.id);
            if (links && links.servers && links.servers.length > 0) {
              const firstWatch = links.servers.find((s) => s.watch && s.watch.trim() !== "");
              if (firstWatch) {
                const url = firstWatch.watch.trim();
                setStreamingUrl(url);
                setStreamingType("iframe");
                console.log("Chosen embed watch URL:", url);
              }
            } else if (!links) {
              setVideoError(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching watch data:", error);
        setVideoError(true);
      }

      setLoading(false);
    };

    fetchData();
  }, [slug, episodeId]);

  const handleSeasonChange = async (season) => {
    setSelectedSeason(season);
    setLoading(true);

    try {
      const episodeData = await getEpisodes(season.id);
      setEpisodes(episodeData || []);

      if (episodeData && episodeData.length > 0) {
        handleEpisodeSelect(episodeData[0]);
      }
    } catch (error) {
      console.error("Error fetching episodes:", error);
    }

    setLoading(false);
  };

  const handleEpisodeSelect = async (episode) => {
    setCurrentEpisode(episode);
    setShowEpisodeList(false);
    setLoading(true);
    setVideoError(false);

    try {
      const links = await getEpisodeLinks(episode.id);
      if (links && links.servers && links.servers.length > 0) {
        const firstWatch = links.servers.find((s) => s.watch && s.watch.trim() !== "");
        if (firstWatch) {
          const url = firstWatch.watch.trim();
          setStreamingUrl(url);
          setStreamingType("iframe");
          console.log("Chosen embed watch URL:", url);
        }
      } else if (!links) {
        setVideoError(true);
      }

      navigate(`/watch/${slug}/${episode.id}`, { replace: true });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error fetching streaming URL:", error);
      setVideoError(true);
    }

    setLoading(false);
  };

  const handleNextEpisode = () => {
    const currentIndex = episodes.findIndex(
      (ep) => ep.id === currentEpisode.id
    );
    if (currentIndex < episodes.length - 1) {
      handleEpisodeSelect(episodes[currentIndex + 1]);
    }
  };

  const handlePreviousEpisode = () => {
    const currentIndex = episodes.findIndex(
      (ep) => ep.id === currentEpisode.id
    );
    if (currentIndex > 0) {
      handleEpisodeSelect(episodes[currentIndex - 1]);
    }
  };

  const handleAnimeClick = async (anime) => {
    try {
      // Prevent navigation, load video in current player
      setLoading(true);
      setVideoError(false);
      window.scrollTo({ top: 0, behavior: "smooth" });

      // Get the anime slug
      const animeSlug = anime.slug || anime.id;

      // Fetch new anime info
      const newAnimeData = await getAnimeInfo(animeSlug);
      setAnimeData(newAnimeData);

      // Fetch seasons for the new anime
      const seasonData = await getSeasonInfo(newAnimeData.id);
      const allSeasons = seasonData.seasons || [];
      setSeasons(allSeasons);

      if (allSeasons.length > 0) {
        const firstSeason = allSeasons[0];
        setSelectedSeason(firstSeason);

        // Fetch episodes for first season
        const episodeData = await getEpisodes(firstSeason.id);
        setEpisodes(episodeData || []);

        if (episodeData && episodeData.length > 0) {
          const firstEpisode = episodeData[0];
          setCurrentEpisode(firstEpisode);

          // Fetch streaming URL for first episode
          const links = await getEpisodeLinks(firstEpisode.id);
          if (links && links.servers && links.servers.length > 0) {
            const firstWatch = links.servers.find((s) => s.watch && s.watch.trim() !== "");
            if (firstWatch) {
              const url = firstWatch.watch.trim();
              setStreamingUrl(url);
              setStreamingType("iframe");
              console.log("Chosen embed watch URL:", url);
            }
          } else if (!links) {
            setVideoError(true);
          }

          // Update URL in browser
          navigate(`/watch/${animeSlug}/${firstEpisode.id}`, {
            replace: false,
          });
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading anime:", error);
      setVideoError(true);
      setLoading(false);
    }
  };

  const handleShowMoreAnime = () => {
    setLoadingMore(true);

    setTimeout(() => {
      if (displayedRelatedCount < relatedAnime.length) {
        setDisplayedRelatedCount((prev) =>
          Math.min(prev + 12, relatedAnime.length)
        );
      } else if (displayedOtherCount < otherAnime.length) {
        setDisplayedOtherCount((prev) =>
          Math.min(prev + 12, otherAnime.length)
        );
      }

      setLoadingMore(false);
    }, 500);
  };

  const totalDisplayed = displayedRelatedCount + displayedOtherCount;
  const totalAvailable = relatedAnime.length + otherAnime.length;
  const hasMoreToShow = totalDisplayed < totalAvailable;

  if (loading && !currentEpisode) {
    return (
      <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff" }}>
        <Navbar />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 80px)",
            marginTop: "80px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                position: "relative",
                marginBottom: "30px",
                display: "inline-block",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  border: "4px solid rgba(229, 9, 20, 0.2)",
                  borderTop: "4px solid #e50914",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <Play
                size={32}
                fill="#e50914"
                color="#e50914"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
            </div>
            <h2
              style={{
                fontSize: "1.8rem",
                fontWeight: "600",
                marginBottom: "10px",
                background: "linear-gradient(135deg, #e50914 0%, #ff1744 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Loading Player...
            </h2>
            <p style={{ color: "#999", fontSize: "1rem" }}>
              Preparing your streaming experience
            </p>
            <div
              style={{
                display: "flex",
                gap: "8px",
                justifyContent: "center",
                marginTop: "20px",
              }}
            >
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "12px",
                    height: "12px",
                    background: "#e50914",
                    borderRadius: "50%",
                    animation: `bounce 1.4s ease-in-out ${
                      i * 0.16
                    }s infinite both`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.7; transform: translate(-50%, -50%) scale(0.95); }
          }
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", color: "#fff" }}>
      <Navbar />

      <div style={{ marginTop: "80px", paddingBottom: "60px" }}>
        <div className="container-fluid" style={{ padding: "0 20px" }}>
          <div className="row">
            {/* Main Video Player */}
            <div className="col-lg-9" style={{ paddingTop: "20px" }}>
              {/* Video Player */}
              <div
                style={{
                  background: "#000",
                  borderRadius: "12px",
                  overflow: "hidden",
                  marginBottom: "20px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                  }}
                >
                  {streamingUrl && (
                    <iframe
                      src={streamingUrl}
                      title="Anime Episode Player"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: "none",
                      }}
                      allowFullScreen
                      allow="autoplay; fullscreen; picture-in-picture"
                    />
                  )}
                </div>
              </div>

              {/* Episode Info & Controls */}
              <div
                className="p-4"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  marginBottom: "20px",
                }}
              >
                <h3 className="fw-bold mb-2">{animeData?.name}</h3>
                <h5 style={{ color: "#ccc" }}>
                  {selectedSeason && `Season ${selectedSeason.num} - `}
                  Episode {currentEpisode?.number}: {currentEpisode?.name}
                </h5>

                {/* Episode Navigation */}
                <div className="d-flex gap-3 mt-4 flex-wrap">
                  <button
                    className="btn px-4"
                    onClick={handlePreviousEpisode}
                    disabled={
                      episodes.findIndex(
                        (ep) => ep.id === currentEpisode?.id
                      ) === 0
                    }
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "#fff",
                      border: "none",
                      opacity:
                        episodes.findIndex(
                          (ep) => ep.id === currentEpisode?.id
                        ) === 0
                          ? 0.5
                          : 1,
                    }}
                  >
                    <ChevronLeft size={18} className="me-2" />
                    Previous
                  </button>

                  <button
                    className="btn px-4"
                    onClick={() => setShowEpisodeList(!showEpisodeList)}
                    style={{
                      background: "#e50914",
                      color: "#fff",
                      border: "none",
                    }}
                  >
                    <List size={18} className="me-2" />
                    Episodes
                  </button>

                  <button
                    className="btn px-4"
                    onClick={handleNextEpisode}
                    disabled={
                      episodes.findIndex(
                        (ep) => ep.id === currentEpisode?.id
                      ) ===
                      episodes.length - 1
                    }
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "#fff",
                      border: "none",
                      opacity:
                        episodes.findIndex(
                          (ep) => ep.id === currentEpisode?.id
                        ) ===
                        episodes.length - 1
                          ? 0.5
                          : 1,
                    }}
                  >
                    Next
                    <ChevronRight size={18} className="ms-2" />
                  </button>

                  <button
                    className="btn px-4 ms-auto"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "#fff",
                      border: "none",
                    }}
                  >
                    <Download size={18} className="me-2" />
                    Download
                  </button>

                  <button
                    className="btn px-4"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "#fff",
                      border: "none",
                    }}
                  >
                    <Share2 size={18} className="me-2" />
                    Share
                  </button>
                </div>

                {/* Episode List Dropdown */}
                {showEpisodeList && (
                  <div
                    className="mt-4 p-3"
                    style={{
                      background: "rgba(0,0,0,0.5)",
                      borderRadius: "10px",
                      maxHeight: "400px",
                      overflowY: "auto",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="fw-bold mb-0">Select Episode</h6>
                      <button
                        className="btn btn-sm"
                        onClick={() => setShowEpisodeList(false)}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "#fff",
                        }}
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="row g-2">
                      {episodes.map((episode) => (
                        <div key={episode.id} className="col-md-4 col-sm-6">
                          <button
                            className="btn w-100 text-start"
                            onClick={() => handleEpisodeSelect(episode)}
                            style={{
                              background:
                                episode.id === currentEpisode?.id
                                  ? "#e50914"
                                  : "rgba(255,255,255,0.1)",
                              color: "#fff",
                              border:
                                episode.id === currentEpisode?.id
                                  ? "2px solid #ff1744"
                                  : "1px solid rgba(255,255,255,0.2)",
                              padding: "12px",
                            }}
                          >
                            <div className="fw-bold">EP {episode.number}</div>
                            <small
                              style={{
                                color:
                                  episode.id === currentEpisode?.id
                                    ? "#fff"
                                    : "#999",
                                fontSize: "0.75rem",
                                display: "block",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {episode.name}
                            </small>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div
                className="p-4 mb-4"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <h5 className="fw-bold mb-3">About this anime</h5>
                <p style={{ color: "#ccc", lineHeight: "1.8" }}>
                  {animeData?.overview || "No description available."}
                </p>
              </div>
            </div>

            {/* Sidebar - Seasons & Episodes */}
            <div className="col-lg-3" style={{ paddingTop: "20px" }}>
              {/* Season Selector */}
              {seasons.length > 1 && (
                <div
                  className="mb-3 p-3"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <h6 className="fw-bold mb-3" style={{ color: "#e50914" }}>
                    Seasons
                  </h6>
                  <div className="d-flex flex-column gap-2">
                    {seasons.map((season) => (
                      <button
                        key={season.id}
                        className="btn text-start"
                        onClick={() => handleSeasonChange(season)}
                        style={{
                          background:
                            selectedSeason?.id === season.id
                              ? "#e50914"
                              : "rgba(255,255,255,0.1)",
                          color: "#fff",
                          border: "none",
                          fontWeight:
                            selectedSeason?.id === season.id ? "600" : "400",
                        }}
                      >
                        Season {season.num}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Episode List */}
              <div
                className="p-3"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  maxHeight: "600px",
                  overflowY: "auto",
                }}
              >
                <h6 className="fw-bold mb-3" style={{ color: "#e50914" }}>
                  Episodes ({episodes.length})
                </h6>
                <div className="d-flex flex-column gap-2">
                  {episodes.map((episode) => (
                    <button
                      key={episode.id}
                      className="btn text-start"
                      onClick={() => handleEpisodeSelect(episode)}
                      style={{
                        background:
                          episode.id === currentEpisode?.id
                            ? "#e50914"
                            : "rgba(255,255,255,0.05)",
                        color: "#fff",
                        border:
                          episode.id === currentEpisode?.id
                            ? "2px solid #ff1744"
                            : "1px solid rgba(255,255,255,0.1)",
                        padding: "12px",
                        transition: "all 0.3s",
                      }}
                      onMouseEnter={(e) => {
                        if (episode.id !== currentEpisode?.id) {
                          e.currentTarget.style.background =
                            "rgba(229, 9, 20, 0.2)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (episode.id !== currentEpisode?.id) {
                          e.currentTarget.style.background =
                            "rgba(255,255,255,0.05)";
                        }
                      }}
                    >
                      <div className="d-flex align-items-center">
                        {episode.id === currentEpisode?.id && (
                          <Play size={16} fill="#fff" className="me-2" />
                        )}
                        <div style={{ flex: 1 }}>
                          <div className="fw-bold">
                            Episode {episode.number}
                          </div>
                          <small
                            style={{
                              color:
                                episode.id === currentEpisode?.id
                                  ? "#fff"
                                  : "#999",
                              fontSize: "0.75rem",
                            }}
                          >
                            {episode.name}
                          </small>
                          {episode.note && (
                            <div>
                              <small style={{ color: "#ffc107" }}>
                                {episode.note}
                              </small>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related/Recommended Anime Section */}
          <div className="row mt-5">
            <div className="col-12">
              <div
                className="p-4"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h4 className="fw-bold mb-1" style={{ color: "#e50914" }}>
                      More Anime To Watch
                    </h4>
                    <p style={{ color: "#999", fontSize: "0.9rem", margin: 0 }}>
                      {displayedOtherCount > 0
                        ? "Discover more amazing shows"
                        : "Similar anime you might enjoy"}
                    </p>
                  </div>
                  <span
                    style={{
                      color: "#666",
                      fontSize: "0.9rem",
                      background: "rgba(255,255,255,0.05)",
                      padding: "8px 16px",
                      borderRadius: "20px",
                    }}
                  >
                    Showing {totalDisplayed} of {totalAvailable}
                  </span>
                </div>

                <div className="row g-3">
                  {/* Show Related Anime First */}
                  {relatedAnime.slice(0, displayedRelatedCount).map((anime) => (
                    <div
                      key={anime.id}
                      className="col-xl-2 col-lg-3 col-md-4 col-sm-6"
                      onClick={() => handleAnimeClick(anime)}
                      style={{ cursor: "pointer" }}
                    >
                      <AnimeCard anime={anime} />
                    </div>
                  ))}

                  {/* Then Show Other Anime */}
                  {displayedRelatedCount >= relatedAnime.length &&
                    otherAnime.slice(0, displayedOtherCount).map((anime) => (
                      <div
                        key={anime.id}
                        className="col-xl-2 col-lg-3 col-md-4 col-sm-6"
                        onClick={() => handleAnimeClick(anime)}
                        style={{ cursor: "pointer" }}
                      >
                        <AnimeCard anime={anime} />
                      </div>
                    ))}
                </div>

                {/* Show More Button */}
                {hasMoreToShow && (
                  <div className="text-center mt-4">
                    <button
                      className="btn px-5 py-3"
                      onClick={handleShowMoreAnime}
                      disabled={loadingMore}
                      style={{
                        background: loadingMore
                          ? "rgba(229, 9, 20, 0.5)"
                          : "linear-gradient(135deg, #e50914 0%, #ff1744 100%)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "30px",
                        fontSize: "1rem",
                        fontWeight: "600",
                        transition: "all 0.3s",
                        boxShadow: "0 4px 15px rgba(229, 9, 20, 0.3)",
                        cursor: loadingMore ? "not-allowed" : "pointer",
                      }}
                      onMouseEnter={(e) => {
                        if (!loadingMore) {
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow =
                            "0 6px 20px rgba(229, 9, 20, 0.4)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 15px rgba(229, 9, 20, 0.3)";
                      }}
                    >
                      {loadingMore ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Loading...
                        </>
                      ) : (
                        <>
                          Show More Anime
                          <ChevronDown size={20} className="ms-2" />
                        </>
                      )}
                    </button>
                    <p
                      style={{
                        color: "#666",
                        fontSize: "0.85rem",
                        marginTop: "15px",
                      }}
                    >
                      {totalAvailable - totalDisplayed} more anime available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default WatchPage;
