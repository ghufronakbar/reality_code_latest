export const routes = {
  home: "/",
  products: "/products",
  product: (id: string) => `/products/${id}`,
  category: (slug: string) => `/categories/${slug}`,
  cart: "/cart",
  checkout: "/checkout",
  account: "/account",
  signin: "/auth/signin",
  signup: "/auth/signup",
  resetPassword: "/auth/reset-password",
};