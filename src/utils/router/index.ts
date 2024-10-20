import { articleRoute } from "./article";
import { authRoute } from "./auth";
import { bannerRoute } from "./banner";
import { brandRoute } from "./brand";
import { categoryRoute } from "./category";
import { dashboardRoute } from "./dashboard";
import { orderRoute } from "./order";
import { productRouter } from "./product";
import { reviewRoute } from "./review";
import { userRoute } from "./user";
import { userProfileRoute } from "./user-profile";

export const Routers = {
  auth: new authRoute(),
  article: new articleRoute(),
  brand: new brandRoute(),
  dashboard: new dashboardRoute(),
  order: new orderRoute(),
  product: new productRouter(),
  category: new categoryRoute(),
  banner: new bannerRoute(),
  review: new reviewRoute(),
  user: new userRoute(),
  userProfile: new userProfileRoute(),
};
