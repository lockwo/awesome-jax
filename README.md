<!--lint ignore double-link-->
# Awesome JAX [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)[<img src="https://raw.githubusercontent.com/google/jax/master/images/jax_logo_250px.png" alt="JAX Logo" align="right" height="100">](https://github.com/google/jax)

<!--lint ignore double-link-->
[JAX](https://github.com/google/jax) brings automatic differentiation and the [XLA compiler](https://github.com/openxla/xla) together through a [NumPy](https://numpy.org/)-like API for high performance machine learning research on accelerators like GPUs and TPUs.
<!--lint enable double-link-->

This is a curated list of awesome JAX libraries, projects, and other resources. Contributions are welcome!

Be sure to check out our (experimental) interactive web version: https://lockwo.github.io/awesome-jax/.

Why do we need another "awesome-jax" list? Existing ones are inactive, and this is directly based on the no longer active Awesome JAX repos https://github.com/n2cholas/awesome-jax/ and https://github.com/mhlr/awesome-jax.

## Contents

- [Libraries](#libraries)
- [Models and Projects](#models-and-projects)
- [Tutorials and Blog Posts](#tutorials-and-blog-posts)
- [Community](#community)


## Libraries

- Neural Network Libraries
    - [Flax](https://github.com/google/flax) - Flax is a neural network library for JAX that is designed for flexibility. <img src="https://img.shields.io/github/stars/google/flax?style=social" align="center">
    - [Equinox](https://github.com/patrick-kidger/equinox) - Elegant easy-to-use neural networks + scientific computing in JAX. <img src="https://img.shields.io/github/stars/patrick-kidger/equinox?style=social" align="center">


- Reinforcement Learning Libraries
    - Algorithms
        - [cleanrl](https://github.com/vwxyzjn/cleanrl) - High-quality single file implementation of Deep Reinforcement Learning algorithms with research-friendly features (PPO, DQN, C51, DDPG, TD3, SAC, PPG). <img src="https://img.shields.io/github/stars/vwxyzjn/cleanrl?style=social" align="center">
        - [rlax](https://github.com/google-deepmind/rlax) - a library built on top of JAX that exposes useful building blocks for implementing reinforcement learning agents. <img src="https://img.shields.io/github/stars/google-deepmind/rlax?style=social" align="center">
        - [purejaxrl](https://github.com/luchris429/purejaxrl) - Really Fast End-to-End Jax RL Implementations. <img src="https://img.shields.io/github/stars/luchris429/purejaxrl?style=social" align="center">
        - [Mava](https://github.com/instadeepai/Mava) - 🦁 A research-friendly codebase for fast experimentation of multi-agent reinforcement learning in JAX. <img src="https://img.shields.io/github/stars/instadeepai/Mava?style=social" align="center">
    - Environments
        - [pgx](https://github.com/sotetsuk/pgx) - Vectorized RL game environments in JAX. <img src="https://img.shields.io/github/stars/sotetsuk/pgx?style=social" align="center">
        - [jumanji](https://github.com/instadeepai/jumanji) - 🕹️ A diverse suite of scalable reinforcement learning environments in JAX. <img src="https://img.shields.io/github/stars/instadeepai/jumanji?style=social" align="center">
        - [gymnax](https://github.com/RobertTLange/gymnax) - RL Environments in JAX 🌍. <img src="https://img.shields.io/github/stars/RobertTLange/gymnax?style=social" align="center">
        - [brax](https://github.com/google/brax) - Massively parallel rigidbody physics simulation on accelerator hardware. <img src="https://img.shields.io/github/stars/google/brax?style=social" align="center">


- Natural Language Processing Libraries
    - [levanter](https://github.com/stanford-crfm/levanter) - Legible, Scalable, Reproducible Foundation Models with Named Tensors and Jax. <img src="https://img.shields.io/github/stars/stanford-crfm/levanter?style=social" align="center">
    - [maxtext](https://github.com/AI-Hypercomputer/maxtext) - A simple, performant and scalable Jax LLM! <img src="https://img.shields.io/github/stars/AI-Hypercomputer/maxtext?style=social" align="center">
    - [EasyLM](https://github.com/young-geng/EasyLM) - Large language models (LLMs) made easy, EasyLM is a one stop solution for pre-training, finetuning, evaluating and serving LLMs in JAX/Flax. <img src="https://img.shields.io/github/stars/young-geng/EasyLM?style=social" align="center">


- JAX Utilities Libraries
    - [jaxtyping](https://github.com/patrick-kidger/jaxtyping) - Type annotations and runtime checking for shape and dtype of JAX/NumPy/PyTorch/etc. arrays. <img src="https://img.shields.io/github/stars/patrick-kidger/jaxtyping?style=social" align="center">
    - [chex](https://github.com/google-deepmind/chex) - a library of utilities for helping to write reliable JAX code. <img src="https://img.shields.io/github/stars/google-deepmind/chex?style=social" align="center">
    - [mpi4jax](https://github.com/mpi4jax/mpi4jax) - Zero-copy MPI communication of JAX arrays, for turbo-charged HPC applications in Python ⚡. <img src="https://img.shields.io/github/stars/mpi4jax/mpi4jax?style=social" align="center">
    - [jax-tqdm](https://github.com/jeremiecoullon/jax-tqdm) - Add a tqdm progress bar to your JAX scans and loops. <img src="https://img.shields.io/github/stars/jeremiecoullon/jax-tqdm?style=social" align="center">
    - [JAX-Toolbox](https://github.com/NVIDIA/JAX-Toolbox) - JAX Toolbox provides a public CI, Docker images for popular JAX libraries, and optimized JAX examples to simplify and enhance your JAX development experience on NVIDIA GPUs. <img src="https://img.shields.io/github/stars/NVIDIA/JAX-Toolbox?style=social" align="center">
    - [penzai](https://github.com/google-deepmind/penzai) - A JAX research toolkit for building, editing, and visualizing neural networks. <img src="https://img.shields.io/github/stars/google-deepmind/penzai?style=social" align="center">
    - [orbax](https://github.com/google/orbax) - Orbax provides common checkpointing and persistence utilities for JAX users. <img src="https://img.shields.io/github/stars/google/orbax?style=social" align="center">


- Computer Vision Libraries
    - [Scenic](https://github.com/google-research/scenic) - Scenic: A Jax Library for Computer Vision Research and Beyond. <img src="https://img.shields.io/github/stars/google-research/scenic?style=social" align="center">
    - [dm_pix](https://github.com/google-deepmind/dm_pix) - PIX is an image processing library in JAX, for JAX. <img src="https://img.shields.io/github/stars/google-deepmind/dm_pix?style=social" align="center">


- Distributions, Sampling, and Probabilistic Libraries
    - [distreqx](https://github.com/lockwo/distreqx) - Distrax, but in equinox. Lightweight JAX library of probability distributions and bijectors. <img src="https://img.shields.io/github/stars/lockwo/distreqx?style=social" align="center">
    - [distrax](https://github.com/google-deepmind/distrax) - a lightweight library of probability distributions and bijectors. <img src="https://img.shields.io/github/stars/google-deepmind/distrax?style=social" align="center">
    - [flowjax](https://github.com/danielward27/flowjax) - Distributions, bijections and normalizing flows using Equinox and JAX. <img src="https://img.shields.io/github/stars/danielward27/flowjax?style=social" align="center">
    - [blackjax](https://github.com/blackjax-devs/blackjax) - BlackJAX is a Bayesian Inference library designed for ease of use, speed and modularity. <img src="https://img.shields.io/github/stars/blackjax-devs/blackjax?style=social" align="center">
    - [bayex](https://github.com/alonfnt/bayex) - Minimal Implementation of Bayesian Optimization in JAX. <img src="https://img.shields.io/github/stars/alonfnt/bayex?style=social" align="center">
    - [efax](https://github.com/NeilGirdhar/efax) - Exponential families for JAX. <img src="https://img.shields.io/github/stars/NeilGirdhar/efax?style=social" align="center">


- [GPJax](https://github.com/JaxGaussianProcesses/GPJax) - Gaussian processes in JAX. <img src="https://img.shields.io/github/stars/JaxGaussianProcesses/GPJax?style=social" align="center">
- [tinygp](https://github.com/dfm/tinygp) - The tiniest of Gaussian Process libraries. <img src="https://img.shields.io/github/stars/dfm/tinygp?style=social" align="center">
- [Diffrax](https://github.com/patrick-kidger/diffrax) - Numerical differential equation solvers in JAX. Autodifferentiable and GPU-capable. <img src="https://img.shields.io/github/stars/patrick-kidger/diffrax?style=social" align="center">
- [jax-md](https://github.com/jax-md/jax-md) - Differentiable, Hardware Accelerated, Molecular Dynamics. <img src="https://img.shields.io/github/stars/jax-md/jax-md?style=social" align="center">
- [lineax](https://github.com/patrick-kidger/lineax) - Linear solvers in JAX and Equinox. <img src="https://img.shields.io/github/stars/patrick-kidger/lineax?style=social" align="center">
- [optimistix](https://github.com/patrick-kidger/optimistix) - Nonlinear optimisation (root-finding, least squares, etc.) in JAX+Equinox. <img src="https://img.shields.io/github/stars/patrick-kidger/optimistix?style=social" align="center">
- [sympy2jax](https://github.com/patrick-kidger/sympy2jax) - Turn SymPy expressions into trainable JAX expressions. <img src="https://img.shields.io/github/stars/patrick-kidger/sympy2jax?style=social" align="center">
- [quax](https://github.com/patrick-kidger/quax) - Multiple dispatch over abstract array types in JAX. <img src="https://img.shields.io/github/stars/patrick-kidger/quax?style=social" align="center">
- [interpax](https://github.com/f0uriest/interpax) - Interpolation and function approximation with JAX. <img src="https://img.shields.io/github/stars/f0uriest/interpax?style=social" align="center">
- [quadax](https://github.com/f0uriest/quadax) - Numerical quadrature with JAX. <img src="https://img.shields.io/github/stars/f0uriest/quadax?style=social" align="center">
- [optax](https://github.com/google-deepmind/optax) - Optax is a gradient processing and optimization library for JAX. <img src="https://img.shields.io/github/stars/google-deepmind/optax?style=social" align="center">
- [dynamax](https://github.com/probml/dynamax) - State Space Models library in JAX. <img src="https://img.shields.io/github/stars/probml/dynamax?style=social" align="center">
- [dynamiqs](https://github.com/dynamiqs/dynamiqs) - High-performance quantum systems simulation with JAX (GPU-accelerated & differentiable solvers). <img src="https://img.shields.io/github/stars/dynamiqs/dynamiqs?style=social" align="center">
- [scico](https://github.com/lanl/scico) - Scientific Computational Imaging COde. <img src="https://img.shields.io/github/stars/lanl/scico?style=social" align="center">
- [exojax](https://github.com/HajimeKawahara/exojax) - 🐈 Automatic differentiable spectrum modeling of exoplanets/brown dwarfs using JAX, compatible with NumPyro and Optax/JAXopt. <img src="https://img.shields.io/github/stars/HajimeKawahara/exojax?style=social" align="center">
- [PGMax](https://github.com/google-deepmind/PGMax) - Loopy belief propagation for factor graphs on discrete variables in JAX. <img src="https://img.shields.io/github/stars/google-deepmind/PGMax?style=social" align="center">
- [evosax](https://github.com/RobertTLange/evosax) - Evolution Strategies in JAX 🦎. <img src="https://img.shields.io/github/stars/RobertTLange/evosax?style=social" align="center">
- [evojax](https://github.com/google/evojax) - EvoJAX is a scalable, general purpose, hardware-accelerated neuroevolution toolkit. Built on top of the JAX library, this toolkit enables neuroevolution algorithms to work with neural networks running in parallel across multiple TPU/GPUs. <img src="https://img.shields.io/github/stars/google/evojax?style=social" align="center">
- [mctx](https://github.com/google-deepmind/mctx) - Monte Carlo tree search in JAX. <img src="https://img.shields.io/github/stars/google-deepmind/mctx?style=social" align="center">
- [kfac-jax](https://github.com/google-deepmind/kfac-jax) - Second Order Optimization and Curvature Estimation with K-FAC in JAX. <img src="https://img.shields.io/github/stars/google-deepmind/kfac-jax?style=social" align="center">
- [jwave](https://github.com/ucl-bug/jwave) - A JAX-based research framework for differentiable and parallelizable acoustic simulations, on CPU, GPUs and TPUs. <img src="https://img.shields.io/github/stars/ucl-bug/jwave?style=social" align="center">
- [jax_cosmo](https://github.com/DifferentiableUniverseInitiative/jax_cosmo) - A differentiable cosmology library in JAX. <img src="https://img.shields.io/github/stars/DifferentiableUniverseInitiative/jax_cosmo?style=social" align="center">
- [jaxlie](https://github.com/brentyi/jaxlie) - Rigid transforms + Lie groups in JAX. <img src="https://img.shields.io/github/stars/brentyi/jaxlie?style=social" align="center">
- [ott](https://github.com/ott-jax/ott) - Optimal transport tools implemented with the JAX framework, to get differentiable, parallel and jit-able computations. <img src="https://img.shields.io/github/stars/ott-jax/ott?style=social" align="center">
- [XLB](https://github.com/Autodesk/XLB) - XLB: Accelerated Lattice Boltzmann (XLB) for Physics-based ML. <img src="https://img.shields.io/github/stars/Autodesk/XLB?style=social" align="center">
- [EasyDeL](https://github.com/erfanzar/EasyDeL) - Accelerate, Optimize performance with streamlined training and serving options with JAX. <img src="https://img.shields.io/github/stars/erfanzar/EasyDeL?style=social" align="center">
- [QDax](https://github.com/adaptive-intelligent-robotics/QDax) - Accelerated Quality-Diversity. <img src="https://img.shields.io/github/stars/adaptive-intelligent-robotics/QDax?style=social" align="center">
- [paxml](https://github.com/google/paxml) - Pax is a Jax-based machine learning framework for training large scale models. Pax allows for advanced and fully configurable experimentation and parallelization, and has demonstrated industry leading model flop utilization rates. <img src="https://img.shields.io/github/stars/google/paxml?style=social" align="center">
- [econpizza](https://github.com/gboehl/econpizza) - Solve nonlinear heterogeneous agent models. <img src="https://img.shields.io/github/stars/gboehl/econpizza?style=social" align="center">
- [fedjax](https://github.com/google/fedjax) - FedJAX is a JAX-based open source library for Federated Learning simulations that emphasizes ease-of-use in research. <img src="https://img.shields.io/github/stars/google/fedjax?style=social" align="center">
- [neural-tangents](https://github.com/google/neural-tangents) - Fast and Easy Infinite Neural Networks in Python. <img src="https://img.shields.io/github/stars/google/neural-tangents?style=social" align="center">
- [jax-fem](https://github.com/deepmodeling/jax-fem) - Differentiable Finite Element Method with JAX. <img src="https://img.shields.io/github/stars/deepmodeling/jax-fem?style=social" align="center">
- [veros](https://github.com/team-ocean/veros) - The versatile ocean simulator, in pure Python, powered by JAX. <img src="https://img.shields.io/github/stars/team-ocean/veros?style=social" align="center">
- [JAXFLUIDS](https://github.com/tumaer/JAXFLUIDS) - Differentiable Fluid Dynamics Package.  <img src="https://img.shields.io/github/stars/tumaer/JAXFLUIDS?style=social" align="center">


### Up and Coming Libraries

- [traceax](https://github.com/mancusolab/traceax) - Stochastic trace estimation using JAX. <img src="https://img.shields.io/github/stars/mancusolab/traceax?style=social" align="center">
- [graphax](https://github.com/jamielohoff/graphax) - Cross-Country Elimination in JAX. <img src="https://img.shields.io/github/stars/jamielohoff/graphax?style=social" align="center">
- [cd_dynamax](https://github.com/hd-UQ/cd_dynamax) - Extension of dynamax repo to cases with continuous-time dynamics with measurements sampled at possibly irregular discrete times. Allows generic inference of dynamical systems parameters from partial noisy observations via auto-differentiable filtering, SGD, and HMC. <img src="https://img.shields.io/github/stars/hd-UQ/cd_dynamax?style=social" align="center">


### Inactive Libraries

- [Haiku](https://github.com/google-deepmind/dm-haiku) - JAX-based neural network library. <img src="https://img.shields.io/github/stars/google-deepmind/dm-haiku?style=social" align="center">
- [jraph](https://github.com/google-deepmind/jraph) - A Graph Neural Network Library in Jax. <img src="https://img.shields.io/github/stars/google-deepmind/jraph?style=social" align="center">
- [SymJAX](https://github.com/SymJAX/SymJAX) - symbolic CPU/GPU/TPU programming. <img src="https://img.shields.io/github/stars/SymJAX/SymJAX?style=social" align="center">
- [coax](https://github.com/coax-dev/coax) - Modular framework for Reinforcement Learning in python. <img src="https://img.shields.io/github/stars/coax-dev/coax?style=social" align="center">
- [eqxvision](https://github.com/paganpasta/eqxvision) - A Python package of computer vision models for the Equinox ecosystem. <img src="https://img.shields.io/github/stars/paganpasta/eqxvision?style=social" align="center">
- [jaxfit](https://github.com/dipolar-quantum-gases/jaxfit) - GPU/TPU accelerated nonlinear least-squares curve fitting using JAX. <img src="https://img.shields.io/github/stars/dipolar-quantum-gases/jaxfit?style=social" align="center">
- [safejax](https://github.com/alvarobartt/safejax) - Serialize JAX, Flax, Haiku, or Objax model params with 🤗`safetensors`. <img src="https://img.shields.io/github/stars/alvarobartt/safejax?style=social" align="center">
- [kernex](https://github.com/ASEM000/kernex) - Stencil computations in JAX. <img src="https://img.shields.io/github/stars/ASEM000/kernex?style=social" align="center">
- [lorax](https://github.com/davisyoshida/lorax) - LoRA for arbitrary JAX models and functions. <img src="https://img.shields.io/github/stars/davisyoshida/lorax?style=social" align="center">
- [mcx](https://github.com/rlouf/mcx) - Express & compile probabilistic programs for performant inference on CPU & GPU. Powered by JAX. <img src="https://img.shields.io/github/stars/rlouf/mcx?style=social" align="center">
- [einshape](https://github.com/google-deepmind/einshape) - DSL-based reshaping library for JAX and other frameworks. <img src="https://img.shields.io/github/stars/google-deepmind/einshape?style=social" align="center">
- [jax-flows](https://github.com/ChrisWaites/jax-flows) - Normalizing Flows in JAX 🌊. <img src="https://img.shields.io/github/stars/ChrisWaites/jax-flows?style=social" align="center">
- [sklearn-jax-kernels](https://github.com/ExpectationMax/sklearn-jax-kernels) - Composable kernels for scikit-learn implemented in JAX. <img src="https://img.shields.io/github/stars/ExpectationMax/sklearn-jax-kernels?style=social" align="center">
- [deltapv](https://github.com/romanodev/deltapv) - A photovoltaic simulator with automatic differentiation. <img src="https://img.shields.io/github/stars/romanodev/deltapv?style=social" align="center">
- [cr-sparse](https://github.com/carnotresearch/cr-sparse) - Functional models and algorithms for sparse signal processing. <img src="https://img.shields.io/github/stars/carnotresearch/cr-sparse?style=social" align="center">
- [flaxvision](https://github.com/rolandgvc/flaxvision) - A selection of neural network models ported from torchvision for JAX & Flax. <img src="https://img.shields.io/github/stars/rolandgvc/flaxvision?style=social" align="center">
- [imax](https://github.com/4rtemi5/imax) - Image augmentation library for Jax. <img src="https://img.shields.io/github/stars/4rtemi5/imax?style=social" align="center">
- [jax-unirep](https://github.com/ElArkk/jax-unirep) - Reimplementation of the UniRep protein featurization model. <img src="https://img.shields.io/github/stars/ElArkk/jax-unirep?style=social" align="center">
- [parallax](https://github.com/srush/parallax) - Immutable Torch Modules for JAX. <img src="https://img.shields.io/github/stars/srush/parallax?style=social" align="center">
- [jax-resnet](https://github.com/n2cholas/jax-resnet/) - Implementations and checkpoints for ResNet, Wide ResNet, ResNeXt, ResNet-D, and ResNeSt in JAX (Flax). <img src="https://img.shields.io/github/stars/n2cholas/jax-resnet?style=social" align="center">
- [elegy](https://github.com/poets-ai/elegy/) - A High Level API for Deep Learning in JAX. <img src="https://img.shields.io/github/stars/poets-ai/elegy?style=social" align="center">
- [objax](https://github.com/google/objax) - Objax is an open source machine learning framework that accelerates research and learning thanks to a minimalist object-oriented design and a readable code base. <img src="https://img.shields.io/github/stars/google/objax?style=social" align="center">
- [jaxrl](https://github.com/ikostrikov/jaxrl) - JAX (Flax) implementation of algorithms for Deep Reinforcement Learning with continuous action spaces. <img src="https://img.shields.io/github/stars/ikostrikov/jaxrl?style=social" align="center">

## Models and Projects

- [whisper-jax](https://github.com/sanchit-gandhi/whisper-jax) - JAX implementation of OpenAI's Whisper model for up to 70x speed-up on TPU. <img src="https://img.shields.io/github/stars/sanchit-gandhi/whisper-jax?style=social" align="center">
- [esm2quinox](https://github.com/patrick-kidger/esm2quinox) - An implementation of ESM2 in Equinox+JAX. <img src="https://img.shields.io/github/stars/patrick-kidger/esm2quinox?style=social" align="center">

## Tutorials and Blog Posts

- [Learning JAX as a PyTorch developer](https://kidger.site/thoughts/torch2jax/)
- [Massively parallel MCMC with JAX](https://rlouf.github.io/post/jax-random-walk-metropolis/)
- [Achieving Over 4000x Speedups and Meta-Evolving Discoveries with PureJaxRL](https://chrislu.page/blog/meta-disco/)
- [How to add a progress bar to JAX scans and loops](https://www.jeremiecoullon.com/2021/01/29/jax_progress_bar/)
- [MCMC in JAX with benchmarks: 3 ways to write a sampler](https://www.jeremiecoullon.com/2020/11/10/mcmcjax3ways/)
- [Deterministic ADVI in JAX](https://martiningram.github.io/deterministic-advi/)
- [Exploring hyperparameter meta-loss landscapes with Jax](http://lukemetz.com/exploring-hyperparameter-meta-loss-landscapes-with-jax/)
- [Evolving Neural Networks in JAX](https://roberttlange.com/posts/2021/02/cma-es-jax/)
- [Meta-Learning in 50 Lines of JAX](https://blog.evjang.com/2019/02/maml-jax.html)
- [Implementing NeRF in JAX](https://wandb.ai/wandb/nerf-jax/reports/Implementing-NeRF-in-JAX--VmlldzoxODA2NDk2?galleryTag=jax)
- [Normalizing Flows in 100 Lines of JAX](https://blog.evjang.com/2019/07/nf-jax.html)
- [JAX vs Julia (vs PyTorch)](https://kidger.site/thoughts/jax-vs-julia/)
- [From PyTorch to JAX: towards neural net frameworks that purify stateful code](https://sjmielke.com/jax-purify.htm)
- [out of distribution detection using focal loss](http://matpalm.com/blog/ood_using_focal_loss/)
- [Differentiable Path Tracing on the GPU/TPU](https://blog.evjang.com/2019/11/jaxpt.html)
- [Getting started with JAX (MLPs, CNNs & RNNs)](https://roberttlange.com/posts/2020/03/blog-post-10/)

### Videos

- [The State of the JAX Ecosystem in 2025](https://www.youtube.com/watch?v=TzULI2PomIw)
- [NeurIPS 2020: JAX Ecosystem Meetup](https://www.youtube.com/watch?v=iDxJxIyzSiM)
- [Introduction to JAX](https://www.youtube.com/watch?v=0mVmRHMaOJ4)
- [JAX: Accelerated Machine Learning Research | SciPy 2020 | VanderPlas](https://www.youtube.com/watch?v=z-WSrQDXkuM)
- [Bayesian Programming with JAX + NumPyro — Andy Kitchen](https://www.youtube.com/watch?v=CecuWGpoztw)

## Community

- [JAX LLM Discord](https://discord.gg/CKazXcbbBm)
