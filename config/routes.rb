Twist::Application.routes.draw do
  root :to => "books#index"
  resources :books do
    member do
      post :receive
    end
  end

  devise_for :users
end