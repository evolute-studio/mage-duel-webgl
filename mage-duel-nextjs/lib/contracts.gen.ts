import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum, ByteArray } from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {

	const build_player_profile_actions_activeSkin_calldata = (): DojoCall => {
		return {
			contractName: "player_profile_actions",
			entrypoint: "active_skin",
			calldata: [],
		};
	};

	const player_profile_actions_activeSkin = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_player_profile_actions_activeSkin_calldata(),
				"evolute_duel",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_player_profile_actions_balance_calldata = (): DojoCall => {
		return {
			contractName: "player_profile_actions",
			entrypoint: "balance",
			calldata: [],
		};
	};

	const player_profile_actions_balance = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_player_profile_actions_balance_calldata(),
				"evolute_duel",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_player_profile_actions_becomeBot_calldata = (): DojoCall => {
		return {
			contractName: "player_profile_actions",
			entrypoint: "become_bot",
			calldata: [],
		};
	};

	const player_profile_actions_becomeBot = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_player_profile_actions_becomeBot_calldata(),
				"evolute_duel",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_cancelGame_calldata = (): DojoCall => {
		return {
			contractName: "game",
			entrypoint: "cancel_game",
			calldata: [],
		};
	};

	const game_cancelGame = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_game_cancelGame_calldata(),
				"evolute_duel",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_player_profile_actions_changeSkin_calldata = (skinId: BigNumberish): DojoCall => {
		return {
			contractName: "player_profile_actions",
			entrypoint: "change_skin",
			calldata: [skinId],
		};
	};

	const player_profile_actions_changeSkin = async (snAccount: Account | AccountInterface, skinId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_player_profile_actions_changeSkin_calldata(skinId),
				"evolute_duel",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_player_profile_actions_changeUsername_calldata = (newUsername: BigNumberish): DojoCall => {
		return {
			contractName: "player_profile_actions",
			entrypoint: "change_username",
			calldata: [newUsername],
		};
	};

	const player_profile_actions_changeUsername = async (snAccount: Account | AccountInterface, newUsername: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_player_profile_actions_changeUsername_calldata(newUsername),
				"evolute_duel",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_createGame_calldata = (): DojoCall => {
		return {
			contractName: "game",
			entrypoint: "create_game",
			calldata: [],
		};
	};

	const game_createGame = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_game_createGame_calldata(),
				"evolute_duel",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_createGameFromSnapshot_calldata = (snapshotId: BigNumberish): DojoCall => {
		return {
			contractName: "game",
			entrypoint: "create_game_from_snapshot",
			calldata: [snapshotId],
		};
	};

	const game_createGameFromSnapshot = async (snAccount: Account | AccountInterface, snapshotId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_game_createGameFromSnapshot_calldata(snapshotId),
				"evolute_duel",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_createSnapshot_calldata = (boardId: BigNumberish, moveNumber: BigNumberish): DojoCall => {
		return {
			contractName: "game",
			entrypoint: "create_snapshot",
			calldata: [boardId, moveNumber],
		};
	};

	const game_createSnapshot = async (snAccount: Account | AccountInterface, boardId: BigNumberish, moveNumber: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_game_createSnapshot_calldata(boardId, moveNumber),
				"evolute_duel",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_finishGame_calldata = (boardId: BigNumberish): DojoCall => {
		return {
			contractName: "game",
			entrypoint: "finish_game",
			calldata: [boardId],
		};
	};

	const game_finishGame = async (snAccount: Account | AccountInterface, boardId: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_game_finishGame_calldata(boardId),
				"evolute_duel",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_joinGame_calldata = (hostPlayer: string): DojoCall => {
		return {
			contractName: "game",
			entrypoint: "join_game",
			calldata: [hostPlayer],
		};
	};

	const game_joinGame = async (snAccount: Account | AccountInterface, hostPlayer: string) => {
		try {
			return await provider.execute(
				snAccount,
				build_game_joinGame_calldata(hostPlayer),
				"evolute_duel",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_makeMove_calldata = (jokerTile: CairoOption<BigNumberish>, rotation: BigNumberish, col: BigNumberish, row: BigNumberish): DojoCall => {
		return {
			contractName: "game",
			entrypoint: "make_move",
			calldata: [jokerTile, rotation, col, row],
		};
	};

	const game_makeMove = async (snAccount: Account | AccountInterface, jokerTile: CairoOption<BigNumberish>, rotation: BigNumberish, col: BigNumberish, row: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_game_makeMove_calldata(jokerTile, rotation, col, row),
				"evolute_duel",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_game_skipMove_calldata = (): DojoCall => {
		return {
			contractName: "game",
			entrypoint: "skip_move",
			calldata: [],
		};
	};

	const game_skipMove = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_game_skipMove_calldata(),
				"evolute_duel",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_player_profile_actions_username_calldata = (): DojoCall => {
		return {
			contractName: "player_profile_actions",
			entrypoint: "username",
			calldata: [],
		};
	};

	const player_profile_actions_username = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_player_profile_actions_username_calldata(),
				"evolute_duel",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	return {
		player_profile_actions: {
			activeSkin: player_profile_actions_activeSkin,
			buildActiveSkinCalldata: build_player_profile_actions_activeSkin_calldata,
			balance: player_profile_actions_balance,
			buildBalanceCalldata: build_player_profile_actions_balance_calldata,
			becomeBot: player_profile_actions_becomeBot,
			buildBecomeBotCalldata: build_player_profile_actions_becomeBot_calldata,
			changeSkin: player_profile_actions_changeSkin,
			buildChangeSkinCalldata: build_player_profile_actions_changeSkin_calldata,
			changeUsername: player_profile_actions_changeUsername,
			buildChangeUsernameCalldata: build_player_profile_actions_changeUsername_calldata,
			username: player_profile_actions_username,
			buildUsernameCalldata: build_player_profile_actions_username_calldata,
		},
		game: {
			cancelGame: game_cancelGame,
			buildCancelGameCalldata: build_game_cancelGame_calldata,
			createGame: game_createGame,
			buildCreateGameCalldata: build_game_createGame_calldata,
			createGameFromSnapshot: game_createGameFromSnapshot,
			buildCreateGameFromSnapshotCalldata: build_game_createGameFromSnapshot_calldata,
			createSnapshot: game_createSnapshot,
			buildCreateSnapshotCalldata: build_game_createSnapshot_calldata,
			finishGame: game_finishGame,
			buildFinishGameCalldata: build_game_finishGame_calldata,
			joinGame: game_joinGame,
			buildJoinGameCalldata: build_game_joinGame_calldata,
			makeMove: game_makeMove,
			buildMakeMoveCalldata: build_game_makeMove_calldata,
			skipMove: game_skipMove,
			buildSkipMoveCalldata: build_game_skipMove_calldata,
		},
	};
}