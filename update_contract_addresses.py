#!/usr/bin/env python3
"""
Script to update contract addresses in .env.local file based on contract data output.
Usage: python update_contract_addresses.py < contract_data.txt
"""

import sys
import re
import os

# Mapping from contract names to environment variable names
CONTRACT_MAPPING = {
    'evolute_duel-game': 'NEXT_PUBLIC_GAME_ADDRESS',
    'evolute_duel-player_profile_actions': 'NEXT_PUBLIC_PLAYER_PROFILE_ADDRESS',
    'evolute_duel-tutorial': 'NEXT_PUBLIC_TUTORIAL_ADDRESS',
    'evolute_duel-account_migration': 'NEXT_PUBLIC_ACCOUNT_MIGRATION_ADDRESS',
    'evolute_duel-evlt_token': 'NEXT_PUBLIC_EVOLUTE_TOKEN_ADDRESS',
    'evolute_duel-tournament': 'NEXT_PUBLIC_TOURNAMENT_ADDRESS',
    'evolute_duel-tournament_token': 'NEXT_PUBLIC_TOURNAMENT_TOKEN_ADDRESS',
    'evolute_duel-matchmaking': 'NEXT_PUBLIC_MATCHMAKING_ADDRESS',
}

def parse_contract_data(input_data):
    """Parse contract data and return a dictionary of contract_name -> address"""
    contracts = {}
    
    for line in input_data.strip().split('\n'):
        if not line.strip():
            continue
            
        # Split by | and clean up whitespace
        parts = [part.strip() for part in line.split('|')]
        
        if len(parts) >= 5:
            contract_name = parts[0]
            # The 5th column (index 4) is the contract address
            contract_address = parts[4]
            contracts[contract_name] = contract_address
    
    return contracts

def update_env_file(contracts, env_file_path='.env.local'):
    """Update the .env.local file with new contract addresses"""
    if not os.path.exists(env_file_path):
        print(f"Error: {env_file_path} not found")
        return False
    
    # Read the current env file
    with open(env_file_path, 'r') as f:
        content = f.read()
    
    updated_content = content
    updated_count = 0
    
    # Update each contract address
    for contract_name, address in contracts.items():
        if contract_name in CONTRACT_MAPPING:
            env_var = CONTRACT_MAPPING[contract_name]
            # Pattern to match the environment variable line
            pattern = f'^{env_var}=".*"( |$)'
            replacement = f'{env_var}="{address}"'
            
            if re.search(pattern, updated_content, re.MULTILINE):
                updated_content = re.sub(pattern, replacement, updated_content, flags=re.MULTILINE)
                updated_count += 1
                print(f"Updated {env_var} to {address}")
            else:
                print(f"Warning: {env_var} not found in {env_file_path}")
    
    # Write the updated content back to the file
    if updated_count > 0:
        with open(env_file_path, 'w') as f:
            f.write(updated_content)
        print(f"\nSuccessfully updated {updated_count} contract addresses in {env_file_path}")
        return True
    else:
        print("No addresses were updated")
        return False

def main():
    # Read input from stdin
    input_data = sys.stdin.read()
    
    if not input_data.strip():
        print("Error: No input data provided")
        print("Usage: python update_contract_addresses.py < contract_data.txt")
        print("Or: your_command | python update_contract_addresses.py")
        sys.exit(1)
    
    # Parse the contract data
    contracts = parse_contract_data(input_data)
    
    if not contracts:
        print("Error: No valid contract data found")
        sys.exit(1)
    
    print(f"Found {len(contracts)} contracts:")
    for name, address in contracts.items():
        print(f"  {name}: {address}")
    print()
    
    # Update the .env.local file
    success = update_env_file(contracts)
    
    if not success:
        sys.exit(1)

if __name__ == '__main__':
    main()