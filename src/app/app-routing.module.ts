import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'library',
    loadChildren: () => import('./library/library.module').then( m => m.LibraryPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'type-views',
    loadChildren: () => import('./type-views/type-views.module').then( m => m.TypeViewsPageModule)
  },
  {
    path: 'sub-list-page',
    loadChildren: () => import('./sub-list-page/sub-list-page.module').then( m => m.SubListPagePageModule)
  },
  {
    path: 'subject-occasion-detail',
    loadChildren: () => import('./subject-occasion-detail/subject-occasion-detail.module').then( m => m.SubjectOccasionDetailPageModule)
  },{
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'poem-detail/:poem_slug',
    loadChildren: () => import('./poem-detail/poem-detail.module').then( m => m.PoemDetailPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'search-result',
    loadChildren: () => import('./search-result/search-result.module').then( m => m.SearchResultPageModule)
  },
  {
    path: 'play-media',
    loadChildren: () => import('./play-media/play-media.module').then( m => m.PlayMediaPageModule)
  },
  {
    path: 'about-haydari',
    loadChildren: () => import('./about-haydari/about-haydari.module').then( m => m.AboutHaydariPageModule)
  },
  {
    path: 'search-filters',
    loadChildren: () => import('./search-filters/search-filters.module').then( m => m.SearchFiltersPageModule)
  },
  {
    path: 'offline',
    loadChildren: () => import('./offline/offline.module').then( m => m.OfflinePageModule)
  },
  {
    path: 'offline-poem-detail',
    loadChildren: () => import('./offline-poem-detail/offline-poem-detail.module').then( m => m.OfflinePoemDetailPageModule)
  },
  {
    path: 'poem-feedback',
    loadChildren: () => import('./poem-feedback/poem-feedback.module').then( m => m.PoemFeedbackPageModule)
  },
  {
    path: 'search-filters-all-recent',
    loadChildren: () => import('./search-filters-all-recent/search-filters-all-recent.module').then( m => m.SearchFiltersAllRecentPageModule)
  },
  {
    path: 'search-auto-complete',
    loadChildren: () => import('./search-auto-complete/search-auto-complete.module').then( m => m.SearchAutoCompletePageModule)
  }
  /*,
  {
    path: 'short-detail-modal',
    loadChildren: () => import('./short-detail-modal/short-detail-modal.module').then( m => m.ShortDetailModalPageModule)
  }*/

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
