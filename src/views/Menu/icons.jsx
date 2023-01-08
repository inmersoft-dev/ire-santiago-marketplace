// places
import {
  Bolt, // electronic
  Hotel, // hotel
  Museum, // museum
  Public,
  Dining, // cafeteria
  Twitter,
  YouTube,
  Balcony, // old house
  Facebook,
  Umbrella, // beauty
  LocalBar, // bar
  LinkedIn,
  CarRental, // car rental
  Pinterest,
  Checkroom, // cloth
  Nightlife, // night life
  LocalMall, // localMall
  ColorLens, // art
  Instagram,
  Restaurant, // restaurant
  LocalLibrary, // library
  BedroomParent, // rent house
  FitnessCenter, // gym
  LocalGasStation, // fuel
  LocalGroceryStore, // shop
} from "@mui/icons-material";

export const socialMediaIcons = (key, props) => {
  switch (key) {
    case "facebook":
      return <Facebook sx={{ ...props }} />;
    case "instagram":
      return <Instagram sx={{ ...props }} />;
    case "twitter":
      return <Twitter sx={{ ...props }} />;
    case "linkedIn":
      return <LinkedIn sx={{ ...props }} />;
    case "pinterest":
      return <Pinterest sx={{ ...props }} />;
    case "youtube":
      return <YouTube sx={{ ...props }} />;
    default:
      return <Public sx={{ ...props }} />;
  }
};

export const placeTypeIcons = {
  oldHouse: <Balcony fontSize="small" />,
  restaurant: <Restaurant fontSize="small" />,
  rentHouse: <BedroomParent fontSize="small" />,
  bar: <LocalBar fontSize="small" />,
  cafeteria: <Dining fontSize="small" />,
  gym: <FitnessCenter fontSize="small" />,
  art: <ColorLens fontSize="small" />,
  museum: <Museum fontSize="small" />,
  library: <LocalLibrary fontSize="small" />,
  nightLife: <Nightlife fontSize="small" />,
  mall: <LocalMall fontSize="small" />,
  shop: <LocalGroceryStore fontSize="small" />,
  beauty: <Umbrella fontSize="small" />,
  electronic: <Bolt fontSize="small" />,
  cloth: <Checkroom fontSize="small" />,
  hotel: <Hotel fontSize="small" />,
  fuel: <LocalGasStation fontSize="small" />,
  carRental: <CarRental fontSize="small" />,
};
