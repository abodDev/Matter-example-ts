opt server_output = "../.zap/server.lua"
opt client_output = "../.zap/client.lua"
opt typescript = true
opt yield_type = "promise"
opt async_lib = "require(game:GetService('ReplicatedStorage').rbxts_include.Promise)"

event replication = {
	from: Server,
	type: Reliable,
	call: ManyAsync,
	data: struct {
		changes: unknown
	},
}
