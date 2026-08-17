FROM node:lts-bookworm-slim

# Build args — override in devcontainer.json to pin a specific version
ARG CLAUDE_CODE_VERSION=latest
ARG ZSH_IN_DOCKER_VERSION=1.2.1

# ── System packages ──────────────────────────────────────────────────────────
RUN apt-get update && apt-get install -y --no-install-recommends \
  git \
  curl \
  wget \
  sudo \
  fzf \
  zsh \
  # Anthropic needed
  bubblewrap \
  socat \
  ca-certificates \
  # Firewall tooling
  iptables \
  ipset \
  dnsutils \
  # Nice-to-haves
  less \
  procps \
  jq \
  && rm -rf /var/lib/apt/lists/*

# ── ZSH with Powerlevel10k ────────────────────────────────────────────────────
RUN sh -c "$(wget -O- \
  https://github.com/deluan/zsh-in-docker/releases/download/v${ZSH_IN_DOCKER_VERSION}/zsh-in-docker.sh \
  )" -- \
  -t https://github.com/romkatv/powerlevel10k \
  -p git \
  -p https://github.com/zsh-users/zsh-autosuggestions \
  -p https://github.com/zsh-users/zsh-completions \
  -a "source /usr/share/doc/fzf/examples/completion.zsh" \
  -a "export PROMPT_COMMAND='history -a' && export HISTFILE=/commandhistory/.bash_history" \
  -x

# ── Persistent directories ────────────────────────────────────────────────────
RUN mkdir -p /commandhistory /workspace \
  && chown -R node:node /commandhistory /workspace

# ── Run as non-root ───────────────────────────────────────────────────────────
USER node
WORKDIR /workspace

# ── Install Claude Code globally ──────────────────────────────────────────────
USER root
RUN npm install -g @anthropic-ai/claude-code@${CLAUDE_CODE_VERSION}
USER node

# ── Firewall script — limited sudo only for this script ──────────────────────
COPY init-firewall.sh /usr/local/bin/init-firewall.sh
USER root
RUN chmod +x /usr/local/bin/init-firewall.sh \
  && echo "node ALL=(root) NOPASSWD: /usr/local/bin/init-firewall.sh" \
  > /etc/sudoers.d/node-firewall \
  && echo 'Defaults!/usr/local/bin/init-firewall.sh !log_allowed' \
  >> /etc/sudoers.d/node-firewall \
  && chmod 0440 /etc/sudoers.d/node-firewall

# Ensure .claude directory exists with correct ownership before volume mounts
RUN mkdir -p /home/node/.claude && chown -R node:node /home/node/.claude

# Default to dangerously-skip-permissions since we're in an isolated container
RUN echo 'alias claude="claude --dangerously-skip-permissions"' >> /home/node/.bashrc

USER node
