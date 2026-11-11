#!/usr/bin/env bash
set -euo pipefail

region="${AWS_REGION:-}"
if [[ -z "$region" ]]; then
  echo "AWS_REGION must be set before cleanup." >&2
  exit 1
fi

account_id="$(aws sts get-caller-identity --query Account --output text)"
echo "Cleaning only matching Elegance resources in AWS account $account_id, region $region."

echo "Finding the Elegance frontend EC2 instance..."
instance_json="$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=elegance-frontend-ec2" \
    "Name=instance-state-name,Values=running,pending,stopped" \
  --output json)"
mapfile -t terminate_ids < <(
  jq -r '.Reservations[].Instances[]
    | select(.State.Name == "pending" or .State.Name == "running" or .State.Name == "stopped")
    | .InstanceId' <<<"$instance_json"
)

if ((${#terminate_ids[@]})); then
  aws ec2 terminate-instances --instance-ids "${terminate_ids[@]}" >/dev/null
fi
if ((${#terminate_ids[@]})); then
  aws ec2 wait instance-terminated --instance-ids "${terminate_ids[@]}"
fi

echo "Deleting the Terraform-managed frontend security groups..."
security_group_ids="$(aws ec2 describe-security-groups \
  --filters "Name=group-name,Values=elegance-frontend-sg-*" \
  --query 'SecurityGroups[].GroupId' \
  --output text)"
for security_group_id in $security_group_ids; do
  if [[ "$security_group_id" != "None" ]]; then
    aws ec2 delete-security-group --group-id "$security_group_id"
  fi
done

echo "Deleting Terraform-generated frontend key pairs..."
key_names="$(aws ec2 describe-key-pairs \
  --query "KeyPairs[?starts_with(KeyName, 'elegance-frontend-key-')].KeyName" \
  --output text)"
for key_name in $key_names; do
  if [[ "$key_name" != "None" ]]; then
    aws ec2 delete-key-pair --key-name "$key_name"
  fi
done

echo "Elegance frontend resources declared by infra/terraform/main.tf were removed."
