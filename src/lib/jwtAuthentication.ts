import { omit } from 'lodash';
import { sign as jwtSign, verify as jwtVerify, decode as jwtDecode, Secret, SignOptions } from 'jsonwebtoken';
import { DEFAULT_JWT_CONFIG } from '../config/jwtConfig';


/**
 * Create a JWT token
 */
export function createJwt(payload: Object, options: CustomSignOptions = DEFAULT_JWT_CONFIG) {
  return signJwt(payload, options['secretOrKey'], omit(options, ['secretOrKey']));
}


/**
 * Authenticate whether the provided JWT token is valid
 */
export function authenticateJwt(token: string, options: CustomSignOptions = DEFAULT_JWT_CONFIG): Promise<{}> {
  if (token === '') throw new Error('JWT token is empty.');
  return verifyJwt(token, options['secretOrKey'], omit(options, ['secretOrKey']));
}


/**
 * Decode a json webtoken without validation
 */
export function decodeJwt(token: string): null | object | string {
  return jwtDecode(token);
}


/**
 * Sign a new json webtoken
 */
function signJwt(payload: Object, secretOrKey: Secret, jwtSettings: SignOptions): Promise<{}> {
  return new Promise((resolve, reject) => {
    jwtSign(payload, secretOrKey, jwtSettings, (error, jwtToken) => {
      if (error) reject(`Something went wrong trying to create a json webtoken. Actual error: ${error}`);
      resolve(jwtToken);
    });
  });
}


/**
 * Verify whether the provided jwt token is valid and return decoded information
 */
function verifyJwt(token: string, secretOrKey: string | Buffer, jwtSettings: SignOptions): Promise<{}> {
  return new Promise((resolve, reject) => {
    jwtVerify(token, secretOrKey, jwtSettings, (error, decoded) => {
      if (error) reject(`Something went wrong trying to verify the json webtoken. Actual error: ${error}`);
      resolve(decoded);
    });
  });
}


// Interfaces
export interface CustomSignOptions extends SignOptions {
  secretOrKey: string;
}
