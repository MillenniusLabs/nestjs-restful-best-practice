import { Injectable } from '@nestjs/common'
import { UsersService } from '../modules/users/users.service'
import { JwtService } from '@nestjs/jwt'
import { comparePassword } from '../utils'
import { UserEntity } from '../modules/users/user.entity'
import { LoginResponseDto } from 'modules/users/dto/login-response.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) { }

	async validateUser(username: string, pass: string): Promise<UserEntity> {
		const user = await this.usersService.findOneWithEmail(username)

		if (user && (await comparePassword(pass, user.password))) {
			const { password, ...result } = user

			return result
		}

		return null
	}

	async login(user: UserEntity): Promise<LoginResponseDto> {
		const { _id } = user
		const payload = { sub: _id }
		const expiresIn = 60 * 60 * 24 * 30

		return {
			accessToken: this.jwtService.sign(payload, {
				expiresIn
			}),
			expiresIn: '30d'
		}

		// const { _id, verified } = user
		// return { _id, verified }
	}
}
