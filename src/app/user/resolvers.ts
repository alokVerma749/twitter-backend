import axios from "axios";
import { prismaClient } from "../../clients/db";
import JWTServices from "../../services/jwt";

interface GoogleJwtPayload {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: string;
  nbf: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: string;
  exp: string;
  jti: string;
  alg: string;
  kid: string;
  typ: string;
}

const queries = {
  verifyUserToken: async (parent: any, { token }: { token: string }) => {
    try {
      const clientToken = token;
      const googleOAuthURL = new URL('https://oauth2.googleapis.com/tokeninfo');
      googleOAuthURL.searchParams.set('id_token', clientToken);

      // Fetch the Google token info
      const { data } = await axios.get<GoogleJwtPayload>(googleOAuthURL.toString(), {
        responseType: 'json',
      });

      // Find or create the user in the database
      let user = await prismaClient.user.findUnique({ where: { email: data.email } });

      if (!user) {
        user = await prismaClient.user.create({
          data: {
            email: data.email,
            firstName: data.given_name,
            lastName: data?.family_name,
            profileImageURL: data.picture,
            password: data.email + "initial", // this will be the initial password
            salt: "",
          },
        });
      }

      // Generate the JWT for the user
      const userToken = JWTServices.generateUserToken(user);
      console.log(userToken,'###')
      return userToken;

    } catch (error) {
      console.error('Error verifying token or fetching user:', error);
      throw new Error('Token verification or user fetch failed.');
    }
  }
};

export const resolvers = { queries };
