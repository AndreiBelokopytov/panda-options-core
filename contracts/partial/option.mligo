#include "constants.mligo"

type option_id = nat

type option_state =
  | Inactive
  | Active
  | Exercised
  | Expired

type option_kind =
  | Call
  | Put

type option_info =
[@layout:comb]
{
  id: option_id;
  strike: nat;
  amount: nat;
  expiration: timestamp;
  kind: option_kind;
  state: option_state;
}

type option_constructor_params =
[@layout:comb]
{
  strike: nat;
  amount: nat;
  period: nat;
  kind: option_kind;
}

let get_next_option_id (current_id: option_id): option_id = current_id + 1n

let create_option (params: option_constructor_params) (current_id: option_id): option_info =
  let next_id = get_next_option_id current_id in
  {
    id = next_id;
    strike = params.strike;
    amount = params.amount;
    expiration = Tezos.now + params.period * one_day;
    kind = params.kind;
    state = Active ()
  }

let change_option_state (state: option_state) (option: option_info): option_info option =
  match option.state with
    | Active -> let _option_info = match state with
        | Active -> None ()
        | _ -> Some ({ option with state = state }) in
      _option_info
    | _ -> None ()