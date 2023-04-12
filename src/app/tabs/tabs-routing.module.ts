import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        children:[
          {
            path:'',
            loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
          },
          {
            path: 'sub-list-page',
            children:[
              {
                path:'',
                loadChildren: () => import('../sub-list-page/sub-list-page.module').then(m => m.SubListPagePageModule)
              },
              {
                path: 'poem-detail',
                loadChildren: () => import('../poem-detail/poem-detail.module').then(m => m.PoemDetailPageModule)
              }
            ]
          },
          {
            path: 'library',
            children:[
              {
                path:'',
                loadChildren: () => import('../library/library.module').then(m => m.LibraryPageModule)
              },
              {
                path: 'poem-detail',
                loadChildren: () => import('../poem-detail/poem-detail.module').then(m => m.PoemDetailPageModule)
              }
            ]
          },
          {
            path: 'search',
            children:[
              {
                path:'',
                loadChildren: () => import('../search/search.module').then(m => m.SearchPageModule)
              },
              {
                path: 'poem-detail',
                loadChildren: () => import('../poem-detail/poem-detail.module').then(m => m.PoemDetailPageModule)
              }
            ]
          },
          {
            path: 'search-result',
            children:[
              {
                path:'',
                loadChildren: () => import('../search-result/search-result.module').then(m => m.SearchResultPageModule)
              },
              {
                path: 'poem-detail',
                loadChildren: () => import('../poem-detail/poem-detail.module').then(m => m.PoemDetailPageModule)
              }
            ]
          }
        ]
      },
      {
        path: 'wishlist',
        children:[
          {
            path:'',
            loadChildren: () => import('../wishlist/wishlist.module').then(m => m.WishlistPageModule)
          },
          {
            path: 'poem-detail',
            loadChildren: () => import('../poem-detail/poem-detail.module').then(m => m.PoemDetailPageModule)
          },
          {
            path: 'offline-poem-detail',
            loadChildren: () => import('../offline-poem-detail/offline-poem-detail.module').then(m => m.OfflinePoemDetailPageModule)
          }
        ]
      },
      {
        path: 'notifications',
        loadChildren: () => import('../notifications/notifications.module').then(m => m.NotificationsPageModule)
      },
      {
        path: 'type-views',
        loadChildren: () => import('../type-views/type-views.module').then( m => m.TypeViewsPageModule)
      },
      {
        path: 'offline',
        children:[
          {
            path:'',
            loadChildren: () => import('../offline/offline.module').then(m => m.OfflinePageModule)
          },
          {
            path: 'offline-poem-detail',
            loadChildren: () => import('../offline-poem-detail/offline-poem-detail.module').then(m => m.OfflinePoemDetailPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        //redirectTo: '/login',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/home',
    //redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
