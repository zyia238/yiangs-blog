import { useEffect, useState } from "react";
import { FaSteam } from "react-icons/fa";
import Image from "next/image";
import Rank from "./rank.png";
import moment from "moment";

type Props = {};
type recentMatch = {
  kills:string,
  assists:string,
  deaths:string,
  start_time:number,
  hero_id:number,
  radiant_win:boolean
};

type profileDataType = {
  profile: {
    avatar: string;
    personaname: string;
    profileurl: string;
  };
};

const Aside = (props: Props) => {
  const [profileData, setProfileData] = useState<profileDataType>({
    profile: { avatar: "", personaname: "", profileurl: "" },
  });
  const [recentMatches, setRecentMatches] = useState<recentMatch[]>([]);
  const goToSteamPage = () => {
    window.location.href =
      profileData.profile && profileData.profile.profileurl;
  };

  useEffect(() => {
    fetch("https://api.opendota.com/api/players/176142908")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setProfileData(data);
      });


    fetch("https://api.opendota.com/api/players/176142908/recentMatches",{
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setRecentMatches(data);
      });
  }, []);
  return (
    <div className="m-box flex-1 rounded-md shadow-md shadow-[#d4d4d5] p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img
            src={profileData.profile && profileData.profile.avatar}
            alt="avatar"
          />
          <span className="ml-2">
            {profileData.profile && profileData.profile.personaname}
          </span>
          <FaSteam
            onClick={goToSteamPage}
            className="text-[#181f46] ml-2 cursor-pointer"
          />
        </div>
        <div>
          <img src={Rank.src} alt="rank" className="w-12" />
        </div>
      </div>
      <ul>
        {recentMatches.map((item,index) => (
            <li className="flex justify-between bg-[#ececec] mb-1 px-2 rounded-sm" key={index}>
              <div className="flex items-center">
                <Image className="w-5 h-5" src={require(`./heroes/${`hero (${item.hero_id > 112 ? 112 : item.hero_id}).png`}`)} alt="heroIcon" width={40} height={40}/>
                <div className="ml-2">{item.kills}/{item.deaths}/{item.assists}</div>
              </div>
              <div className={item.radiant_win ? 'wBar' : 'lBar'}>
                {moment(item.start_time).add(53,'years').fromNow() }
              </div>
            </li>
        ))}
      </ul>
    </div>
  );
};

export default Aside;
